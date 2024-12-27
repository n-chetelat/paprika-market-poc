import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/queries/auth";
import LogoutButton from "./LogoutButton";

type NavLinksProps = {
  className?: string;
};

export default async function NavLinks({ className }: NavLinksProps) {
  const loggedIn = await isLoggedIn();
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Link href="/catalog" className="hover:underline">
        Catalog
      </Link>

      {loggedIn && (
        <>
          <Link href="/business" className="hover:underline">
            Business
          </Link>
          <LogoutButton />
        </>
      )}

      {!loggedIn && (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}
