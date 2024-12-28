import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { getUserBusinesses } from "@/queries/business";
import { User } from "@/lib/types";
import Link from "next/link";

type BusinessSelectProps = {
  user: User;
};

export default async function BusinessSelect({ user }: BusinessSelectProps) {
  const businesses = await getUserBusinesses();
  return (
    <div className="flex flex-col gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>Go to Business</DropdownMenuTrigger>
        <DropdownMenuContent forceMount align="end" alignOffset={50}>
          {!!businesses &&
            businesses.map((business) => {
              return (
                <DropdownMenuItem key={business.id}>
                  <Link href={`/business/${business.id}`}>{business.name}</Link>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
