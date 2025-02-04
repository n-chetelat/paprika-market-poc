"use client";

import { useActionState } from "react";
import { createCoupon } from "@/actions/stripe";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
    <form action={action} className="flex flex-col gap-4 container mx-auto">
      <div>
        <Label className="text-md" htmlFor="name">
          Coupon Name
        </Label>
        <Input id="name" type="text" name="name" />
      </div>
      <div>
        <Label className="text-md" htmlFor="discount">
          Discount Amount
        </Label>
        <Input id="discount" type="number" name="discount" />
      </div>
      <div className="flex flex-col">
        <Label className="text-md" htmlFor="duration">
          Duration
        </Label>
        <select name="duration" id="duration" className="p-2 border rounded-md">
          <option value="once">Once</option>
          <option value="repeating">Repeating</option>
        </select>
      </div>
      <div>
        <Label className="text-md" htmlFor="durationInMonths">
          Duration in months (if repeating duration):
        </Label>
        <Input id="durationInMonths" type="number" name="durationInMonths" />
      </div>
      <div>
        <Label className="text-md" htmlFor="productIds">
          Product IDs (comma separated):
        </Label>
        <Textarea id="productIds" name="productIds" />
      </div>
      <Input type="hidden" name="stripeAccountId" value={stripeAccountId} />
      <Input type="hidden" name="businessId" value={businessId} />
      <Button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="w-1/4 mx-auto min-w-60"
      >
        Create Coupon
      </Button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
