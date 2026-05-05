import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname.replace(/\/$/, "") || "/";
  const isLogin = path === "/admin/login";

  if (isLogin) {
    if (req.auth) {
      return NextResponse.redirect(new URL("/admin/orders", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
