import { decrypt } from "@/lib/session";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session?.userId as string },
    });

    if (user) return user;
  }
  return null;
}

export async function isLoggedIn() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session?.userId) return true;
  return false;
}

export async function isInBusiness() {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (session?.userId) {
    const userBusiness = await prisma.userBusiness.findFirst({
      where: { userId: session?.userId as string },
    });

    if (userBusiness) return true;
  }
  return false;
}
