import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect root to /en
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }
  
  // Ensure locale is in path
  const locale = pathname.split("/")[1];
  if (!["en", "hi", "te"].includes(locale) && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

