import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isAuthed = Boolean(req.auth);

  // Gate the auth-only admin section.
  if (pathname.startsWith("/app") && !isAuthed) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // If a signed-in user visits /login, send them to the dashboard.
  if (pathname === "/login" && isAuthed) {
    return NextResponse.redirect(new URL("/app", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  // Avoid running middleware on Next internals, the auth API itself, and assets.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|images|files|robots.txt).*)"],
};
