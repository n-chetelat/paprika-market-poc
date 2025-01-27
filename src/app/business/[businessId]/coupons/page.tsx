import CreateCouponForm from "@/components/business/CreateCouponForm";
import { getBusiness, isInBusinessWithId } from "@/queries/business";
import { notFound } from "next/navigation";

export default async function BusinessCouponsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const businessId = (await params).businessId;
  const isUserInBusiness = await isInBusinessWithId(businessId);
  if (!isUserInBusiness) notFound();

  const business = await getBusiness(businessId);

  return (
    <div>
      <CreateCouponForm
        stripeAccountId={business.stripeAccountId}
        businessId={business.id}
      />
    </div>
  );
}
