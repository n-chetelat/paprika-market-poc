"use client";

import { OrderWithProduct } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { issueRefund } from "@/actions/stripe";

type BusinessOrderRefundFormProps = {
  order: OrderWithProduct;
};

export default function BusinessOrderRefundForm({
  order,
}: BusinessOrderRefundFormProps) {
  const [status, action, pending] = useActionState(issueRefund, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="orderId" value={order.id} />
      <input
        type="hidden"
        name="checkoutSessionId"
        value={order.stripeCheckoutSessionId}
      />
      <Button disabled={pending} aria-disabled={pending}>
        Refund
      </Button>
    </form>
  );
}
