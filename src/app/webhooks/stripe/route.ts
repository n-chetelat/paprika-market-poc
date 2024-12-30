import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { HANDLED_EVENTS } from "@/jobs/stripe";
import { inngest } from "@/lib/inngest";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const content = await request.text();
    const event = stripe.webhooks.constructEvent(
      content,
      request.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string
    );

    if (!HANDLED_EVENTS.includes(event.type)) {
      return NextResponse.json({ received: true });
    }

    await inngest.send({
      name: "stripe/handle-event",
      data: { stripeEvent: event },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    return new NextResponse(
      `Webook validation failed: ${(error as Error).message}`,
      { status: 400 }
    );
  }
}
