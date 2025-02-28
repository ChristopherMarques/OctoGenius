import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const session = await supabase.auth.getSession();

  // Rotas protegidas
  const protectedRoutes = [
    "/dashboard",
    "/plano-estudos",
    "/questoes",
    "/estatisticas",
    "/diagnostico",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!session.data.session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("completed_diagnostic")
      .eq("id", session.data.session.user.id)
      .single();

    console.log("Profile:", profile);
    console.log("Current path:", request.nextUrl.pathname);
    console.log(
      "Should redirect:",
      !profile?.completed_diagnostic &&
        request.nextUrl.pathname !== "/diagnostico"
    );

    if (
      profile &&
      !profile.completed_diagnostic &&
      request.nextUrl.pathname !== "/diagnostico"
    ) {
      return NextResponse.redirect(new URL("/diagnostico", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/plano-estudos/:path*",
    "/questoes/:path*",
    "/estatisticas/:path*",
    "/diagnostico/:path*",
  ],
};
