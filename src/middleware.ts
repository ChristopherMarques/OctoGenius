import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { showLogs } from "./lib/utils/show-logs";

const publicRoutes = ["/", "/auth", "/api/auth/*"];

const secret = process.env.AUTH_SECRET;

export const middleware = async (req: NextRequest) => {
  showLogs("Verificando autenticação...");
  const token = await getToken({ req, secret });
  const isAuthenticated = !!token;
  showLogs(`Autenticação: ${isAuthenticated}`);

  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthenticated && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Lógica de redirecionamento pós-login
  if (isAuthenticated && !isPublicRoute) {
    // Aqui você deve verificar se o usuário já tem um plano de estudos ativo.
    // Esta é uma lógica ilustrativa. A verificação real deve ser feita
    // consultando o seu banco de dados.
    const hasStudyPlan = token.hasStudyPlan; // Você precisará adicionar essa informação ao token

    if (!hasStudyPlan && req.nextUrl.pathname !== "/diagnostico") {
      return NextResponse.redirect(new URL("/diagnostico", req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
