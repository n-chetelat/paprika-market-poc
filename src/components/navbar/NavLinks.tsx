import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isInBusiness } from "@/queries/auth";
import AvatarMenu from "@/components/navbar/AvatarMenu";

type NavLinksProps = {
  className?: string;
};

export default async function NavLinks({ className }: NavLinksProps) {
  const user = await getCurrentUser();
  const inBusiness = await isInBusiness();
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Link href="/catalog" className="hover:underline">
        Catalog
      </Link>

      {user && <AvatarMenu user={user} showBusinessOptions={inBusiness} />}

      {!user && (
        <>
          <Button asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </>
      )}
    </div>
  );
}
