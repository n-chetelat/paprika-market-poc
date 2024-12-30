"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { isInBusinessWithId } from "@/queries/business";
import { redirect } from "next/navigation";
import {
  createStripeAccount,
  createStripeAccountLink,
} from "@/actions/lib/stripe";

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

// FOR REMOVING TEST ACCOUNTS
// export async function deleteStripeAccount() {
//   const deleted = await stripe.accounts.del("acct_1QbS37PLHN9m2vNq");
// }
