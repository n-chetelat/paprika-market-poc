"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateTaxSettings } from "@/actions/stripe";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaxCodeSelect from "@/components/stripe/TaxCodeSelect";
import { StripeTaxCode } from "@/lib/types";

type StripeTaxSettingsForm = {
  stripeAccountId: string;
  stripeTaxCodes: StripeTaxCode[];
};

export default function StripeTaxSettingsForm({
  stripeAccountId,
  stripeTaxCodes,
}: StripeTaxSettingsForm) {
  const [state, action] = useActionState(updateTaxSettings, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Tax code</Label>
          <TaxCodeSelect stripeTaxCodes={stripeTaxCodes} />
          <Label htmlFor="address1">Address line 1</Label>
          <Input id="address1" name="addressLine1" />
          <Label htmlFor="address2">Address line 2</Label>
          <Input id="address2" name="addressLine2" />
          <Label htmlFor="city">City</Label>
          <Input id="city" name="addressCity" />
          <Label htmlFor="province">Province</Label>
          <Input id="province" name="addressState" />
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" name="addressPostalCode" />
          <Input type="hidden" name="addressCountry" value="CA" />
          <Input type="hidden" name="accountId" value={stripeAccountId} />
        </CardContent>
        <CardFooter className="justify-center">
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
