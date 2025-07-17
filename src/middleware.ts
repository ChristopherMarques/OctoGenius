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

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
