import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type EventData = {
  stripeEvent: any;
};

export const HANDLED_EVENTS = [
  "account.application.authorized",
  "account.updated",
  "checkout.session.completed",
  "refund.created",
  "refund.updated",
  "refund.failed",
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
      case "checkout.session.completed":
        handleCheckoutCompleted(eventData);
        break;
      case "refund.created":
      case "refund.updated":
        handleRefundSuccessful(eventData);
        break;
      case "refund.failed":
        handleRefundUnsuccessful(eventData);
        break;
      default:
        console.log(`Unhandled event type ${eventData.stripeEvent.type}`);
    }
    return { event };
  }
);

async function handleAccountCreated(eventData: EventData) {
  const account = await stripe.accounts.retrieve(
    eventData.stripeEvent.account as string
  );
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

  // Add a record of any reasons that the verification was not successful.
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

async function handleCheckoutCompleted(eventData: EventData) {
  const checkoutSessionId = eventData.stripeEvent.data.object.id;
  const userId = eventData.stripeEvent.data.object.client_reference_id;
  const amountTotal = eventData.stripeEvent.data.object.amount_total;
  const productId = eventData.stripeEvent.data.object.metadata.productId;
  const mode = eventData.stripeEvent.data.object.mode;

  const order = await prisma.order.create({
    data: {
      productId,
      customerId: userId,
      stripeCheckoutSessionId: checkoutSessionId,
      pricePaidInCents: amountTotal,
      mode: mode === "subscription" ? "subscription" : "oneTime",
    },
  });

  if (!order) {
    console.log(
      `Unable to create order for checkout session ${checkoutSessionId}`
    );
    return;
  }

  // Decrease quantity from inventory
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { quantity: true },
  });
  const quantity =
    product && product?.quantity - 1 < 0
      ? 0
      : (product?.quantity as number) - 1;
  await prisma.product.update({
    where: { id: productId },
    data: { quantity },
  });

  if (mode === "subscription") {
    const subscriptionId = eventData.stripeEvent.data.object.subscription;

    await prisma.subscription.create({
      data: {
        orderId: order.id,
        userId,
        stripeSubscriptionId: subscriptionId,
      },
    });
  }

  console.log(`Order was created from checkout session ${checkoutSessionId}`);
}

async function handleRefundSuccessful(eventData: EventData) {
  const orderId = eventData.stripeEvent.data.object.metadata.orderId;
  const refundSuccessful =
    eventData.stripeEvent.data.object.status === "succeeded";
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    console.log(`Unable to find order ${orderId} to register refund.`);
    return;
  }

  if (!order.refundedAt && refundSuccessful) {
    await prisma.order.update({
      where: { id: orderId },
      data: { refundedAt: new Date() },
    });

    console.log(`Successfully refunded transaction`);
  }
}

async function handleRefundUnsuccessful(eventData: EventData) {
  const orderId = eventData.stripeEvent.data.object.metadata.orderId;
  console.log(`Unable to refund order ${orderId}`);
}
