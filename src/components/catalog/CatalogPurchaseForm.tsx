"use client";

import { purchaseProduct } from "@/actions/stripe";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

type CatalogPurchaseFormProps = {
  product: Product;
};

export default function CatalogPurchaseForm({
  product,
}: CatalogPurchaseFormProps) {
  const [state, action] = useActionState(purchaseProduct, undefined);

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
    <Button disabled={pending} aria-disabled={pending}>
      Purchase
    </Button>
  );
}
