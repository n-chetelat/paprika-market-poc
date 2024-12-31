import BusinessOrdersTable from "@/components/business/BusinessOrdersTable";
import BackButton from "@/components/common/BackButton";
import { TypographyH1 } from "@/components/ui/typography";
import { isInBusinessWithId } from "@/queries/business";
import { getOrdersForBusiness } from "@/queries/order";
import { notFound } from "next/navigation";

export default async function BusinessProductPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const businessId = (await params).businessId;
  const isUserInBusiness = await isInBusinessWithId(businessId);
  if (!isUserInBusiness) notFound();

  const orders = await getOrdersForBusiness(businessId);

  return (
    <div>
      <TypographyH1>Orders</TypographyH1>
      <BackButton toPath={`/business/${businessId}`} />
      <BusinessOrdersTable orders={orders} />
    </div>
  );
}
