"use client";

import { createConnectedAccount } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { TypographyP } from "../ui/typography";

type StripeAccountFormProps = {
  businessId: string;
  stripeAccountId?: string;
  className?: string;
};

export default function StripeAccountForm({
  businessId,
  stripeAccountId,
  className,
}: StripeAccountFormProps) {
  const [state, action] = useActionState(createConnectedAccount, undefined);

  return (
    <form action={action} className={cn(className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {stripeAccountId
              ? "Finish up Connecting to Stripe"
              : "Connect to Stripe"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            We use Stripe to process payments and collect the funds from the
            sale of your products. Connect your bank account to Stripe and
            provide your business information so you can start getting paid!
          </TypographyP>
        </CardContent>
        <CardFooter className="flex flex-col">
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="accountId" value={stripeAccountId} />
          <StripeAccountFormSubmitButton stripeAccountId={stripeAccountId} />
        </CardFooter>
      </Card>
    </form>
  );
}

function StripeAccountFormSubmitButton({
  stripeAccountId,
}: {
  stripeAccountId?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} aria-disabled={pending}>
      {stripeAccountId ? "Continue Connecting to Stripe" : "Connect to Stripe"}
    </Button>
  );
}
