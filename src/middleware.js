import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login";
  // path === "/calendar" ||
  // path === "/profile" ||
  // path === "/forms/form-layout" ||
  // path === "/tables";

  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/calendar",
    "/profile",
    "/forms/form-layout",
    "/tables",
  ],
};
