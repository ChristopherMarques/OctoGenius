import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  try {
    // Verificar a sessão
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Rotas que não precisam de autenticação
    const publicRoutes = ["/", "/auth/callback"];
    const isPublicRoute = publicRoutes.some(
      (route) =>
        request.nextUrl.pathname === route ||
        request.nextUrl.pathname.startsWith("/auth/")
    );

    // Se não há sessão e a rota não é pública, redirecionar para home
    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
