import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getSessionUserId() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  return session?.userId;
}

export async function getCurrentUser() {
  const sessionUserId = await getSessionUserId();

  if (sessionUserId) {
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId as string },
    });

    if (user) return user;
  }
  return null;
}

export async function isLoggedIn() {
  const sessionUserId = await getSessionUserId();

  if (sessionUserId) return true;
  return false;
}

export async function isInBusiness() {
  const sessionUserId = await getSessionUserId();

  if (sessionUserId) {
    const userBusiness = await prisma.userBusiness.findFirst({
      where: { userId: sessionUserId as string },
    });

    if (userBusiness) return true;
  }
  return false;
}
