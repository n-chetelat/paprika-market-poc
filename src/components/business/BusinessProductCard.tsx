import { Product } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type BusinessProductCardProps = {
  product: Product;
};

export default function BusinessProductCard({
  product,
}: BusinessProductCardProps) {
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
        <div className="relative w-36 h-36">
          <Image
            src={imageSrc}
            className="object-cover"
            fill
            alt={`Image of ${product.name}`}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-2xl font-bold">{price}</p>
          <p>{product.published ? "Published" : "Unpublished"}</p>
          {product.quantity > 0 ? (
            <p className="flex flex-row items-center gap-2">
              In Stock <CircleCheck className="stroke-green-700" />
            </p>
          ) : (
            <p className="flex flex-row items-center gap-2">
              Out of Stock <CircleX className="stroke-red-700" />
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link">
          <Link href={`/business/${product.businessId}/products/${product.id}`}>
            <span>See product</span> <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
