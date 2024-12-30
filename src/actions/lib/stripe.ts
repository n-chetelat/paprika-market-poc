import { stripe } from "@/lib/stripe";

export async function createStripeAccount(businessId: string) {
  try {
    const account = await stripe.accounts.create({
      country: "CA",
      controller: {
        stripe_dashboard: {
          type: "express",
        },
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
      },
      metadata: {
        businessId,
      },
    });
    return { accountId: account.id };
  } catch (error) {
    console.error("An error occurred while creating Stripe account", error);
    return null;
  }
}

export async function createStripeAccountLink(
  businessId: string,
  accountId: string
) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.SERVER_URL}/business/${businessId}/payments`,
      return_url: `${process.env.SERVER_URL}/business/${businessId}/payments`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  } catch (error) {
    console.error(
      "An error occurred while creating Stripe account link",
      error
    );
    return null;
  }
}
