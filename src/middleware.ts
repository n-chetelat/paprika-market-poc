import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const loginPage = "/login";
const protectedRoutes = ["/business", "/cart"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((pr) => path.startsWith(pr));

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const isSessionExpired = session?.expiresAt
    ? new Date(session?.expiresAt as string) < new Date()
    : true;
  const isLoggedIn = session?.userId && !isSessionExpired;

  if (isLoggedIn && path === loginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
