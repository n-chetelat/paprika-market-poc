"use client";

import { deleteStripeAccount, getStripeDashboardLink } from "@/actions/stripe";
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
import { TypographyP } from "@/components/ui/typography";

type StripeAccountFormProps = {
  businessId: string;
  className?: string;
};

export default function StripeAccountDashboardForm({
  businessId,
  className,
}: StripeAccountFormProps) {
  const [state, action] = useActionState(getStripeDashboardLink, undefined);

  return (
    <form action={deleteStripeAccount} className={cn(className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Visit your Stripe Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyP>
            Your Stripe dashbaord contains details about all your transactions,
            sales, and more!
          </TypographyP>
        </CardContent>
        <CardFooter className="flex flex-col">
          <input type="hidden" name="businessId" value={businessId} />
          <StripeDashbaordSubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function StripeDashbaordSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} aria-disabled={pending}>
      Go to Stripe Dashboard
    </Button>
  );
}
