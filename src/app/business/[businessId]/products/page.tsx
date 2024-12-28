import BusinessProductCard from "@/components/BusinessProductCard";
import { TypographyH1 } from "@/components/ui/typography";
import { isInBusinessWithId } from "@/queries/business";
import { getBusinessProducts } from "@/queries/product";
import { notFound } from "next/navigation";

export default async function BusinessProductsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const businessId = (await params).businessId;
  const isUserInBusiness = await isInBusinessWithId(businessId);
  if (!isUserInBusiness) notFound();

  const products = await getBusinessProducts(businessId);

  return (
    <div>
      <TypographyH1>Manage Products</TypographyH1>
      <ul className="grid grid-cols-4 gap-8 p-8">
        {!!products &&
          products.map((product) => (
            <li key={product.id}>
              <BusinessProductCard product={product} />
            </li>
          ))}
      </ul>
    </div>
  );
}
