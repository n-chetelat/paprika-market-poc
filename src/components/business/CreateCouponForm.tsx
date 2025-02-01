"use client";

import { useActionState } from "react";
import { createCoupon } from "@/actions/stripe";

type CreateCouponFormProps = {
  stripeAccountId: string;
  businessId: string;
};

export default function CreateCouponForm({
  stripeAccountId,
  businessId,
}: CreateCouponFormProps) {
  const [state, action, pending] = useActionState(createCoupon, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Coupon Name:</label>
        <input id="name" type="text" name="name" required />
      </div>
      <div>
        <label htmlFor="discount">Discount:</label>
        <input id="discount" type="number" name="discount" required />
      </div>
      <div>
        <label htmlFor="duration">Duration:</label>
        <select name="duration" id="duration">
          <option value="once">Once</option>
          <option value="repeating">Repeating</option>
        </select>
      </div>
      <div>
        <label htmlFor="duration_in_months">
          Duration in months (if repeating duration):
        </label>
        <input
          id="duration_in_months"
          type="number"
          name="duration_in_months"
        />
      </div>
      <div></div>
      <div>
        <label htmlFor="productIds">Product IDs (comma separated):</label>
        <textarea id="productIds" name="productIds" />
      </div>
      <input type="hidden" name="stripeAccountId" value={stripeAccountId} />
      <input type="hidden" name="businessId" value={businessId} />
      <button type="submit" disabled={pending} aria-disabled={pending}>
        Create Coupon
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
