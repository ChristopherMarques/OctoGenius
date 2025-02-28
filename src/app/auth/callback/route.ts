import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";
import { createBrowserClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const error = requestUrl.searchParams.get("error");
    const error_description = requestUrl.searchParams.get("error_description");

    // Log para debug
    console.log("Callback params:", {
      code: code ? "present" : "missing",
      error,
      error_description,
      fullUrl: request.url,
    });

    // Verificar se há erro no callback do OAuth
    if (error) {
      console.error("OAuth error:", error, error_description);
      return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
    }

    // Verificar se o código está presente
    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(new URL("/?error=no_code", request.url));
    }

    // Exchange code for session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(
        new URL(`/?error=session_error`, request.url)
      );
    }

    if (!session?.user) {
      console.error("No user in session");
      return NextResponse.redirect(new URL("/?error=no_user", request.url));
    }

    // Log para debug
    console.log("Session established:", {
      userId: session.user.id,
      email: session.user.email,
    });

    // Criar/atualizar usuário no banco
    try {
      const { error: upsertError } = await supabaseAdmin.from("users").upsert(
        {
          id: session.user.id,
          email: session.user.email,
          full_name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "Unknown",
          avatar_url:
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        }
      );

      if (upsertError) {
        console.error("Error upserting user:", upsertError);
        // Continuar mesmo com erro de upsert
      }
    } catch (error) {
      console.error("Error in user creation/update:", error);
      // Continuar mesmo com erro
    }

    // Redirecionar para dashboard após sucesso
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/?error=callback_error", request.url)
    );
  }
}
