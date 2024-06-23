import { NextResponse, type NextRequest } from "next/server";

const needAuthRoutes = ["/profile"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const currentUser = req.cookies.get("appSession")?.value;

  // Basic check if you are not logged in and trying to access a route
  const needAuth = needAuthRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  if (!currentUser && needAuth) {
    return Response.redirect(new URL("/api/auth/login", req.url));
  }

  // if on homepage and logged in, redirect to dashboard
  if (currentUser && req.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
