import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import { getAllProducts } from "@/queries/product";

export default async function CatalogPage() {
  const products = await getAllProducts();
  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <CatalogProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}
