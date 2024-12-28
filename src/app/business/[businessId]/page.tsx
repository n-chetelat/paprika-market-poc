import { getCurrentUser } from "@/queries/auth";
import { getBusiness, isInBusinessWithId } from "@/queries/business";
import { notFound } from "next/navigation";
import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const user = await getCurrentUser();
  const businessId = (await params).businessId;
  const isUserInBusiness = await isInBusinessWithId(businessId);
  if (!isUserInBusiness) notFound();

  const business = await getBusiness(businessId);
  return (
    <div className="flex flex-col gap-8">
      <TypographyH1>Welcome, {user?.firstName}!</TypographyH1>
      <TypographyH2>Here is your overview for {business.name}:</TypographyH2>
      <div className="flex flex-row justify-evenly">
        <Card className="p-4 min-w-80">
          <CardHeader>
            <CardTitle className="text-center">Earnings</CardTitle>
          </CardHeader>
          <CardContent className="text-5xl text-center">$402</CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link href="#">See breakdown</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="p-4 min-w-80">
          <CardHeader>
            <CardTitle className="text-center">Products</CardTitle>
          </CardHeader>
          <CardContent className="text-5xl text-center">34</CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link href={`/business/${businessId}/products`}>
                See products
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="p-4 min-w-80">
          <CardHeader>
            <CardTitle className="text-center">Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-5xl text-center">23</CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link href={`/business/${businessId}/orders`}>See orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
