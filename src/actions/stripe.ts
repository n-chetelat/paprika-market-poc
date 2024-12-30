"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getUserBusinesses, isInBusinessWithId } from "@/queries/business";
import { redirect } from "next/navigation";
import {
  createStripeAccount,
  createStripeAccountLink,
} from "@/actions/lib/stripe";
import { getCurrentUser, getSessionUserId } from "@/queries/auth";

export async function createConnectedAccount(
  prevState: any,
  formData: FormData
) {
  const businessId = formData.get("businessId") as string;
  let accountId = formData.get("accountId") as string | undefined;
  // check first if the account already exists,
  // in case the user had left in the middle of linking their account
  console.log("accountId is ", accountId);

  if (!accountId) {
    const account = await createStripeAccount(businessId);
    accountId = account?.accountId;
  }

  if (accountId) {
    const accountLink = await createStripeAccountLink(businessId, accountId);
    if (accountLink) return redirect(accountLink.url);
  }
}

export async function getStripeDashboardLink(
  prevState: any,
  formData: FormData
) {
  const businessId = formData.get("businessId") as string;
  const currentUserInBusiness = await isInBusinessWithId(businessId);

  if (!currentUserInBusiness) {
    throw new Error(
      `The current user is not authorized to access business ${businessId}`
    );
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { stripeAccountId: true, isStripeVerified: true },
  });

  if (!business?.stripeAccountId || !business?.isStripeVerified) {
    throw new Error(
      `Business with ID ${businessId} does not have a verified Stripe account`
    );
  }

  const dashboardLink = await stripe.accounts.createLoginLink(
    business.stripeAccountId
  );

  return redirect(dashboardLink.url);
}

export async function buyProduct(prevState: any, formData: FormData) {
  const userId = await getSessionUserId();

  const productId = formData.get("productId") as string;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      imageURLs: true,
      priceInCents: true,
      business: {
        select: { stripeAccountId: true },
      },
    },
  });

  if (!userId || !product) {
    throw new Error(`Product could not be found: ${productId}`);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: userId as string,
    line_items: [
      {
        price_data: {
          currency: "CAD",
          unit_amount: product.priceInCents,
          product_data: {
            name: product.name,
            images: product.imageURLs,
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: Math.floor(product.priceInCents * 0.1),
      transfer_data: {
        destination: product.business.stripeAccountId,
      },
    },
    success_url: `${process.env.SERVER_URL}/purchase/success`,
    cancel_url: `${process.env.SERVER_URL}/catalog`,
    metadata: {
      productId: product.id,
    },
  });

  return redirect(checkoutSession.url as string);
}

// FOR REMOVING TEST ACCOUNTS
// export async function deleteStripeAccount() {
//   const deleted = await stripe.accounts.del("acct_1QbS37PLHN9m2vNq");
// }
