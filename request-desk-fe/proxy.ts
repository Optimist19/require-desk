import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const isLoggedIn = request.cookies.get("refreshToken");
  if (!isLoggedIn && request.nextUrl.pathname !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };