import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { showLogs } from "./lib/utils/show-logs";

// Definindo as rotas que podem ser acessadas sem autenticação
const publicRoutes = ["/", "/auth", "/api/auth/*"];

const secret = process.env.AUTH_SECRET; // Certifique-se de que o segredo está definido

export const middleware = async (req: NextRequest) => {
  showLogs("Verificando autenticação...");
  const token = await getToken({ req, secret }); // Verifica se o usuário está autenticado
  const isAuthenticated = !!token; // Verifica se o token existe
  showLogs(`Autenticação: ${isAuthenticated}`);

  // Verifica se a rota é pública
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Se não estiver autenticado e a rota não for pública, redireciona para a página de login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // Permite o acesso à rota
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
