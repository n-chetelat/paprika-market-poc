import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const homePage = "/";
const loginPage = "/login";
const publicRoutes = ["/catalog", "/webhooks"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute =
    path === homePage || publicRoutes.some((pr) => path.startsWith(pr));

  if (isPublicRoute) return NextResponse.next();

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const isSessionExpired = session?.expiresAt
    ? new Date(session?.expiresAt as string) < new Date()
    : true;
  const isLoggedIn = session?.userId && !isSessionExpired;

  if (isLoggedIn && path === loginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
