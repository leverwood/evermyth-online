import { getSession } from "@auth0/nextjs-auth0/edge";
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

  // if you are logged in and don't have a username, redirect to set one
  const session = await getSession(req, res);
  if (session && !session.user?.userPK && req.nextUrl.pathname !== "/profile") {
    return Response.redirect(new URL("/profile", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
