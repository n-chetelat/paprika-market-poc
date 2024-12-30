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
import { TypographyInlineCode, TypographyP } from "@/components/ui/typography";

type StripeAccountFormProps = {
  businessId: string;
  stripeAccountId?: string;
  blockerReason: string;
  className?: string;
};

export default function StripeAccountBlockedForm({
  businessId,
  stripeAccountId,
  blockerReason,
  className,
}: StripeAccountFormProps) {
  const [state, action] = useActionState(createConnectedAccount, undefined);

  return (
    <form action={action} className={cn(className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Your Stripe verification needs attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            It seems there are some issues with your Stripe account
            verification. Here is the information we have:
          </TypographyP>
          <TypographyInlineCode>{blockerReason}</TypographyInlineCode>
          <TypographyP>
            Please retry the verification process to solve any issues.
          </TypographyP>
        </CardContent>
        <CardFooter className="flex flex-col">
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="accountId" value={stripeAccountId} />
          <StripeBlockerFormSubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function StripeBlockerFormSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} aria-disabled={pending}>
      Retry Connection to Stripe
    </Button>
  );
}
