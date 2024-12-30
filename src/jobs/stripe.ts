import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type EventData = {
  stripeEvent: any;
};

export const HANDLED_EVENTS = [
  "account.application.authorized",
  "account.updated",
  //   "payment_intent.succeeded",
  //   "payment_intent.processing",
  //   "payment_intent.payment_failed",
  //   "refund.created",
  //   "refund.updated",
  //   "refund.failed",
];

export const handleStripeEvent = inngest.createFunction(
  { id: "stripe-handler" },
  { event: "stripe/handle-event" },
  async ({ event, step }) => {
    const eventData = event.data;
    switch (eventData.stripeEvent.type) {
      case "account.application.authorized":
        await handleAccountCreated(eventData);
        break;
      case "account.updated":
        handleAccountUpdated(eventData);
        break;
      default:
        console.log(`Unhandled event type ${eventData.stripeEvent.type}`);
    }
    return { event };
  }
);

async function handleAccountCreated(eventData: EventData) {
  const account = await stripe.accounts.retrieve(eventData.stripeEvent.account);
  await prisma.business.update({
    where: { id: account.metadata?.businessId },
    data: { stripeAccountId: account.id },
  });
  console.log(
    `Successfully created Stripe account for business "${account.metadata?.businessId}"`
  );
}

async function handleAccountUpdated(eventData: EventData) {
  const businessId = eventData.stripeEvent.data.object.metadata.businessId;
  const disabledReason =
    eventData.stripeEvent.data.object.requirements.disabled_reason;

  // Add a record of any reasons why the verification was not successful.
  // Use this record to notify user later.
  if (disabledReason) {
    const blocker = await prisma.stripeDisabledReason.findFirst({
      where: { businessId, code: disabledReason },
    });
    if (!blocker) {
      await prisma.stripeDisabledReason.create({
        data: { businessId, code: disabledReason },
      });
    }

    console.log(`Unable to update account status for business ${businessId}`);
    console.log(`Disabled reason: ${disabledReason}`);
    return;
  }

  const chargesEnabled = eventData.stripeEvent.data.object.charges_enabled;
  const payoutsEnabled = eventData.stripeEvent.data.object.payouts_enabled;

  if (chargesEnabled && payoutsEnabled) {
    await prisma.business.update({
      where: { id: businessId },
      data: { isStripeVerified: chargesEnabled && payoutsEnabled },
    });

    // delete any remaining blockers
    await prisma.stripeDisabledReason.deleteMany({
      where: { businessId },
    });
    console.log(
      `Successfully updated Stripe account for business "${businessId}"`
    );
  }
}
