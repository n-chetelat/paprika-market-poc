"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { isInBusinessWithId } from "@/queries/business";
import { redirect } from "next/navigation";
import {
  createStripeAccount,
  createStripeAccountLink,
} from "@/actions/lib/stripe";
import { getCurrentUser } from "@/queries/auth";

export async function createConnectedAccount(
  prevState: any,
  formData: FormData
) {
  const businessId = formData.get("businessId") as string;
  let accountId = formData.get("accountId") as string | undefined;
  // check first if the account already exists,
  // in case the user had left in the middle of linking their account

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

export async function purchaseProduct(prevState: any, formData: FormData) {
  let user = await getCurrentUser();

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

  if (!user || !product) {
    throw new Error(`Product could not be found: ${productId}`);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: user.stripeCustomerId as string,
    allow_promotion_codes: true,
    client_reference_id: user.id,
    customer_update: {
      address: "auto",
    },
    automatic_tax: {
      enabled: true,
      liability: {
        type: "account",
        account: product.business.stripeAccountId,
      },
    },
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
    // You can pass the CHECKOUT_SESSION_ID string here and it will be replaced by the actual id
    success_url: `${process.env.SERVER_URL}/purchase/success?ssession_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SERVER_URL}/catalog`,
    metadata: {
      productId: product.id,
    },
  });

  return redirect(checkoutSession.url as string);
}

export async function purchaseSubscription(prevState: any, formData: FormData) {
  let user = await getCurrentUser();

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

  if (!user || !product) {
    throw new Error(`Product could not be found: ${productId}`);
  }

  const checkoutSession = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      automatic_tax: {
        enabled: true,
        liability: {
          type: "account",
          account: product.business.stripeAccountId,
        },
      },
      customer: user.stripeCustomerId as string,
      customer_update: {
        name: "never",
        address: "auto",
      },
      client_reference_id: user.id,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      consent_collection: {
        payment_method_reuse_agreement: {
          position: "auto",
        },
        terms_of_service: "none",
      },
      saved_payment_method_options: {
        payment_method_save: "enabled",
      },
      line_items: [
        {
          price_data: {
            currency: "CAD",
            unit_amount: product.priceInCents,
            recurring: {
              interval: "month",
              interval_count: 1,
            },
            product_data: {
              name: product.name,
              images: product.imageURLs,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        on_behalf_of: product.business.stripeAccountId,
        application_fee_percent: 0.0,
        transfer_data: {
          destination: product.business.stripeAccountId,
        },
        invoice_settings: {
          issuer: {
            type: "account",
            account: product.business.stripeAccountId,
          },
        },
      },
      submit_type: "subscribe",
      success_url: `${process.env.SERVER_URL}/purchase/success?ssession_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/catalog`,
      metadata: {
        productId: product.id,
      },
    }
    // { stripeAccount: product.business.stripeAccountId } // This should link the subscription to the connected account but the client ID needs to be the account's client.
  );

  return redirect(checkoutSession.url as string);
}

export async function issueRefund(prevState: any, formData: FormData) {
  const checkoutSessionId = formData.get("checkoutSessionId") as string;
  const orderId = formData.get("orderId") as string;
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId
  );

  const paymentIntentId = checkoutSession.payment_intent;

  if (!paymentIntentId) {
    throw new Error(
      `Payment intent unavailable for checkout session ${checkoutSessionId}`
    );
  }

  await stripe.refunds.create({
    payment_intent: paymentIntentId as string,
    reason: "requested_by_customer",
    refund_application_fee: true,
    reverse_transfer: true, // Required by refund_application_fee: true
    metadata: {
      orderId,
    },
  });
}

export async function updateTaxSettings(prevState: any, formData: FormData) {
  const taxCode = formData.get("taxCode") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const addressCity = formData.get("addressCity") as string;
  const addressState = formData.get("addressState") as string;
  const addressCountry = formData.get("addressCountry") as string;
  const addressPostalCode = formData.get("addressPostalCode") as string;
  const sripeAccountId = formData.get("accountId") as string;

  await stripe.tax.settings.update(
    {
      defaults: {
        tax_behavior: "inferred_by_currency",
        tax_code: taxCode,
      },
      head_office: {
        address: {
          line1: addressLine1,
          line2: addressLine2,
          postal_code: addressPostalCode,
          city: addressCity,
          state: addressState,
          country: addressCountry,
        },
      },
    },
    { stripeAccount: sripeAccountId }
  );
}

export async function createTaxRegistrations(
  prevState: any,
  formData: FormData
) {
  let activeFrom: number | "now" = parseInt(
    formData.get("activeFrom") as string
  ); // timestamp
  if (isNaN(activeFrom)) {
    activeFrom = "now";
  }
  const expiresAt = parseInt(formData.get("expiresAt") as string); // timestamp
  const stripeAccountId = formData.get("accountId") as string;
  const standardTax = formData.get("standardTax") as string;

  const province = formData.get("province") as
    | "QC"
    | "MB"
    | "SK"
    | "BC"
    | "none";

  type taxType = "standard" | "simplified" | "province_standard" | "";

  let type: taxType = "";
  if (standardTax === "yes") {
    if (province && province !== "none") {
      type = "province_standard";
    } else {
      type = "standard";
    }
  } else {
    throw new Error("Select a tax registration type");
  }

  const payload = {
    country: "CA",
    active_from: activeFrom,
    country_options: {
      ca: {
        type: type,
        province_standard: {
          province: province === "none" ? "" : province,
        },
      },
    },
    expires_at: isNaN(expiresAt) ? undefined : expiresAt,
  };
  console.log(payload);
  await stripe.tax.registrations.create(payload, {
    stripeAccount: stripeAccountId,
  });
}

//   FOR REMOVING TEST ACCOUNTS
export async function deleteStripeAccount() {
  const deleted = await stripe.accounts.del("acct_1QcyvdPLarMjgyQS");
}
