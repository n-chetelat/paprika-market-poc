"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createTaxRegistrations } from "@/actions/stripe";
import { Input } from "@/components/ui/input";

export default function StripeTaxRegistrationForm() {
  const [state, action] = useActionState(createTaxRegistrations, undefined);

  return (
    <form action={action}>
      <Input type="text" />
      <Button>Submit</Button>
    </form>
  );
}
