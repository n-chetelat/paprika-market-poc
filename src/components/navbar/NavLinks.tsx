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

      {user && (
        <>
          {inBusiness && (
            <Link href="/business" className="hover:underline">
              Business
            </Link>
          )}
          <AvatarMenu user={user} />
        </>
      )}

      {!user && (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );
}
