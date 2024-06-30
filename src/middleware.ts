import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse, type NextRequest } from "next/server";
import { getSubUser } from "./app/_data/subuser-dto";
import { updateSession } from "@auth0/nextjs-auth0";

const needAuthRoutes = [
  "/profile",
  "/dashboard",
  "/campaigns",
  "/creatures",
  "/items",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const currentUser = req.cookies.get("appSession")?.value;

  // Basic check if you are not logged in and trying to access a route
  const needAuth = needAuthRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  if (!currentUser && needAuth) {
    console.log(`Redirecting to login: ${req.nextUrl.pathname}`);
    return Response.redirect(new URL("/api/auth/login", req.url));
  }

  // if you are logged in and don't have a username, redirect to set one
  const session = await getSession(req, res);
  if (
    session &&
    !session.user?.userPK &&
    req.nextUrl.pathname !== "/profile/username"
  ) {
    // TODO: double check you don't have a username
    return Response.redirect(new URL("/profile/username", req.url));
  }

  // if you are logged in and try to hit the homepage, redirect to the dashboard
  if (session && req.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
