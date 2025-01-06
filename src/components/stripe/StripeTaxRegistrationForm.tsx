"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { createTaxRegistrations } from "@/actions/stripe";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn, dateToTimestamp, formatDate } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

type StripeTaxRegistrationFormProps = {
  stripeAccountId: string;
};

export default function StripeTaxRegistrationForm({
  stripeAccountId,
}: StripeTaxRegistrationFormProps) {
  const [state, action] = useActionState(createTaxRegistrations, undefined);
  const [activeFrom, setActiveFrom] = useState<Date>();
  const [expiresAt, setExpiresAt] = useState<Date>();
  const [province, setProvince] = useState<string>("");
  const [standardTax, setStandardTax] = useState<string>("");

  const provincialStandard = [
    {
      label: "None",
      value: "none",
    },
    {
      label: "Quebec QST",
      value: "QC",
    },
    {
      label: "Manitoba RST",
      value: "MB",
    },
    {
      label: "Saskatchewan PST",
      value: "SK",
    },
    {
      label: "British Columbia PST",
      value: "BC",
    },
  ];

  return (
    <form action={action}>
      <Card>
        <CardHeader>
          <CardTitle>Tax Registrations</CardTitle>
          <CardDescription>
            Where are you registered to collect taxes?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Label htmlFor="fromDate">Active from date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !activeFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {activeFrom ? formatDate(activeFrom) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={activeFrom}
                className="bg-white"
                onSelect={setActiveFrom}
                disabled={(d) => d < new Date()}
              />
            </PopoverContent>
          </Popover>
          <Input
            id="fromDate"
            type="hidden"
            name="activeFrom"
            value={dateToTimestamp(activeFrom) ?? ""}
          />

          <Label htmlFor="expiresAt">Expires at (optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !activeFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {expiresAt ? formatDate(expiresAt) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={expiresAt}
                className="bg-white"
                onSelect={setExpiresAt}
                disabled={(d) => d < (activeFrom ?? new Date())}
              />
            </PopoverContent>
          </Popover>
          <Input
            id="expiresAt"
            type="hidden"
            name="expiresAt"
            value={dateToTimestamp(expiresAt) ?? ""}
          />

          <Label htmlFor="standardTax">
            Are you registered to collect GST/HST in Canada?
          </Label>
          <RadioGroup onValueChange={(e) => setStandardTax(e)}>
            <div className="flex flex-row gap-2">
              <RadioGroupItem value="yes" id="canadaTaxTrue" />
              <Label htmlFor="canadaTaxTrue">Yes</Label>
            </div>
            <div className="flex flex-row gap-2">
              <RadioGroupItem value="no" id="canadaTaxFalse" />
              <Label htmlFor="canadaTaxFalse">No</Label>
            </div>
          </RadioGroup>
          <Input
            id="standardTax"
            type="hidden"
            name="standardTax"
            value={standardTax}
          />

          <Label htmlFor="province">
            Are you registered to collect provincial GST/HST in any of these
            provinces?
          </Label>
          <Select onValueChange={(value) => setProvince(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              {provincialStandard.map((ps) => (
                <SelectItem key={ps.value} value={ps.value}>
                  {ps.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input id="province" type="hidden" name="province" value={province} />

          <Input type="hidden" name="accountId" value={stripeAccountId} />
        </CardContent>
        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
