import BackButton from "@/components/common/BackButton";
import StripeAccountBlockedForm from "@/components/stripe/StripeAccountBlockedForm";
import StripeAccountDashboardForm from "@/components/stripe/StripeAccountDashboardForm";
import StripeAccountForm from "@/components/stripe/StripeAccountForm";
import {
  getBusiness,
  getStripeBlockersForBusiness,
  isInBusinessWithId,
} from "@/queries/business";
import { notFound } from "next/navigation";

export default async function BusinessPaymentsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const businessId = (await params).businessId;
  const isUserInBusiness = await isInBusinessWithId(businessId);
  if (!isUserInBusiness) notFound();

  const business = await getBusiness(businessId);

  const blockers = await getStripeBlockersForBusiness(businessId);
  const blocker = blockers[-1]?.code;

  const formDimensions = "min-w-[32rem] w-1/3 m-auto";

  // Possible states:
  // - Has not started to connect to Stripe -> account id is null, is verified is false, has no blockers
  // - Started to connect and left -> account id is string, is verified is false, has no blockers
  // - Connected and there are still things to do -> account id is string, is verified is false, has blockers
  // - Already connected to Stripe successfully -> account id is string, is verified is true, has no blockers

  return (
    <div>
      <BackButton toPath={`/business/${businessId}`} />
      {!blocker && !business.isStripeVerified && (
        <StripeAccountForm
          businessId={businessId}
          stripeAccountId={business.stripeAccountId}
          className={formDimensions}
        />
      )}

      {blocker && (
        <StripeAccountBlockedForm
          businessId={businessId}
          stripeAccountId={business.stripeAccountId}
          blockerReason={blocker}
          className={formDimensions}
        />
      )}

      {!blocker && business.isStripeVerified && (
        <StripeAccountDashboardForm
          businessId={businessId}
          className={formDimensions}
        />
      )}
    </div>
  );
}
