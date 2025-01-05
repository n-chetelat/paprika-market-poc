"use client";

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StripeTaxCode } from "@/lib/types";

type TaxCodeSelectProps = {
  stripeTaxCodes: StripeTaxCode[];
};

export default function TaxCodeSelect({
  stripeTaxCodes = [],
}: TaxCodeSelectProps) {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a tax code" />
      </SelectTrigger>
      <SelectContent>
        {stripeTaxCodes.map((taxCode) => (
          <SelectItem value={taxCode.id} key={taxCode.id}>
            {taxCode.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
