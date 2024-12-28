import prisma from "@/lib/prisma";
import { getSessionUserId } from "@/queries/auth";

export async function getBusiness(businessId: string) {
  const currentUserInBusiness = await isInBusinessWithId(businessId);

  if (!currentUserInBusiness) {
    throw new Error(
      `The current user is not authorized to access business ${businessId}`
    );
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    throw new Error(`Business with ID ${businessId} cannot be found`);
  }

  return business;
}

export async function getUserBusinesses() {
  const sessionUserId = await getSessionUserId();

  if (!sessionUserId) {
    throw new Error("There is no user currently logged in");
  }

  const businesses = await prisma.business.findMany({
    where: { userBusinesses: { some: { userId: sessionUserId } } },
  });

  return businesses;
}

export async function isInBusinessWithId(businessId: string) {
  const sessionUserId = await getSessionUserId();

  if (sessionUserId) {
    const userBusiness = await prisma.userBusiness.findFirst({
      where: { userId: sessionUserId as string, businessId },
    });

    if (userBusiness) return true;
  }
  return false;
}
