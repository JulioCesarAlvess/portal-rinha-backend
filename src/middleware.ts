import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  if (req.nextUrl.pathname.startsWith("/cadastro") && !isAuthenticated) {
    return;
  }

  if (
    (req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/cadastro")) &&
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const authMiddleware = await withAuth({
    pages: {
      signIn: `/login`,
    },
  });

  // @ts-expect-error
  return authMiddleware(req, event);
}

export const config = {
  matcher: ["/((?!api|static|favicon.ico|_next|icons|fonts|images).*)"],
};
