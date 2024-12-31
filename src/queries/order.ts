import prisma from "@/lib/prisma";
import { isInBusinessWithId } from "@/queries/business";

export async function getOrdersForBusiness(businessId: string) {
  const currentUserInBusiness = await isInBusinessWithId(businessId);

  if (!currentUserInBusiness) {
    throw new Error(
      `The current user is not authorized to access business ${businessId}`
    );
  }

  const orders = await prisma.order.findMany({
    where: { product: { businessId } },
    include: { product: true },
  });

  return orders;
}
