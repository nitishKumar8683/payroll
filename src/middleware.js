import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";
  const role = request.cookies.get("role")?.value || ""; 

  // console.log("Path:", path);
  // console.log("Token:", token);
  // console.log("Role:", role);

  const adminPaths = [
    "/",
    "/calendar",
    "/profile",
    "/forms/form-layout",
    "/tables",
    "/settings",
  ];
  const managerPaths = ["/", "/calendar", "/profile", "/settings"];
  const employeePaths = ["/", "/calendar", "/profile", "/settings"];

  let allowedPaths = [];
  switch (role) {
    case "admin":
      allowedPaths = adminPaths;
      break;
    case "manager":
      allowedPaths = managerPaths;
      break;
    case "employee":
      allowedPaths = employeePaths;
      break;
    default:
      allowedPaths = [];
      break;
  }

  console.log("Allowed Paths:", allowedPaths);

  const isAllowedPath = allowedPaths.includes(path);
  const isPublicPath = path === "/login";

  if (!isPublicPath && !token) {
    console.log("Redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isPublicPath && token) {
    switch (role) {
      case "admin":
        console.log("Redirecting to /");
        return NextResponse.redirect(new URL("/", request.nextUrl));
      case "manager":
        console.log("Redirecting to /manager-dashboard");
        return NextResponse.redirect(new URL("/", request.nextUrl));
      case "employee":
        console.log("Redirecting to /employee-dashboard");
        return NextResponse.redirect(new URL("/", request.nextUrl));
      default:
        console.log("Redirecting to /");
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  if (!isAllowedPath && token) {
    console.log("Redirecting to /");
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return null;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/calendar",
    "/profile",
    "/forms/form-layout",
    "/tables",
    "/settings",
    "/manager-dashboard",
    "/employee-dashboard",
  ],
};
