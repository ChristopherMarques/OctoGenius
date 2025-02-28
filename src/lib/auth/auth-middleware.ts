import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/database/types/database.types";

export async function updateUserProfile(supabase: any, user: any) {
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select()
    .eq("id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error fetching user:", fetchError);
    return;
  }

  const userData = {
    id: user.id,
    email: user.email,
    full_name:
      user.user_metadata?.full_name || user.user_metadata?.name || "Unknown",
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    updated_at: new Date().toISOString(),
  };

  if (!existingUser) {
    // Create new user
    const { error: insertError } = await supabase
      .from("users")
      .insert([userData]);

    if (insertError) {
      console.error("Error creating user:", insertError);
    }
  } else {
    // Update existing user
    const { error: updateError } = await supabase
      .from("users")
      .update(userData)
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user:", updateError);
    }
  }
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Auth error:", error);
  }

  if (session?.user) {
    await updateUserProfile(supabase, session.user);
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
