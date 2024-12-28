import prisma from "@/lib/prisma";
import { isInBusinessWithId } from "./business";

export async function getBusinessProducts(businessId: string) {
  const currentUserInBusiness = await isInBusinessWithId(businessId);

  if (!currentUserInBusiness) {
    throw new Error(
      `The current user is not authorized to access business ${businessId}`
    );
  }

  const products = await prisma.product.findMany({
    where: { businessId },
  });

  return products;
}
