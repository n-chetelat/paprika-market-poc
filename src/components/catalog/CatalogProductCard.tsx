import { Product } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { CircleCheck, CircleX } from "lucide-react";
import CatalogPurchaseForm from "@/components/catalog/CatalogPurchaseForm";
import CatalogSubscribeForm from "./CatalogSubscribeForm";

type CatalogProductCardProps = {
  product: Product;
};

export default function CatalogProductCard({
  product,
}: CatalogProductCardProps) {
  const imageSrc = product.imageURLs.length
    ? product.imageURLs[0]
    : "generic_product.jpg";
  const price = formatCurrency(product.priceInCents / 100);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row gap-8">
        <div className="relative h-36 w-36">
          <Image
            src={imageSrc}
            alt={`Image of ${product.name}`}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-2xl font-bold">{price}</p>
          {product.quantity > 0 ? (
            <p className="flex flex-row items-center gap-2">
              In Stock <CircleCheck className="stroke-green-700" />
            </p>
          ) : (
            <p className="flex flex-row items-center gap-2">
              Out of Stock <CircleX className="stroke-red-700" />
            </p>
          )}
          <div className="flex flex-row gap-4">
            <CatalogPurchaseForm product={product} />
            <CatalogSubscribeForm product={product} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
