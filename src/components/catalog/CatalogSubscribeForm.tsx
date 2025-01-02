"use client";

import { purchaseSubscription } from "@/actions/stripe";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

type CatalogSubscribeFormProps = {
  product: Product;
};

export default function CatalogSubscribeForm({
  product,
}: CatalogSubscribeFormProps) {
  const [state, action] = useActionState(purchaseSubscription, undefined);

  return (
    <form action={action}>
      <input type="hidden" name="productId" value={product.id} />
      <CatalogFormButton />
    </form>
  );
}

function CatalogFormButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="secondary" disabled={pending} aria-disabled={pending}>
      Subscribe
    </Button>
  );
}
