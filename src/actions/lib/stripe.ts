import { stripe } from "@/lib/stripe";
import { User } from "@/lib/types";
import Stripe from "stripe";

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

export async function createCustomer(user: User) {
  const customer = await stripe.customers.create({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
  });

  if (!customer) {
    throw new Error(
      `An error occurred while creating a customer for user ${user.id}`
    );
  }

  return customer;
}

// https://docs.stripe.com/tax/tax-for-platforms#set-up
export async function updateTaxSettings(prevState: any, formData: FormData) {
  const taxCode = formData.get("taxCode") as string;
  const addressLine1 = formData.get("addressLine1") as string;
  const addressLine2 = formData.get("addressLine2") as string;
  const addressCity = formData.get("addressCity") as string;
  const addressState = formData.get("addressState") as string;
  const addressCountry = formData.get("addressCountry") as string;
  const addressPostalCode = formData.get("addressPostalCode") as string;
  const sripeAccountId = formData.get("accountId") as string;

  // "txcd_10000000" // general code
  // "txcd_50021003" // fitness class code

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
  const activeFrom = formData.get("activeFrom") as string; // timestamp like 1735886532
  const type = formData.get("type") as
    | "standard"
    | "simplified"
    | "province_standard";
  const province = formData.get("province") as string;
  const stripeAccountId = formData.get("accountId") as string;

  const payload = {
    country: "CA",
    active_from: parseInt(activeFrom),
    country_options: {
      ca: {
        type: type,
      },
    },
  };

  if (province && type === "province_standard") {
    payload.country_options.ca.province_standard = {
      province,
    };
  }

  await stripe.tax.registrations.create(payload, {
    stripeAccount: stripeAccountId,
  });
}
