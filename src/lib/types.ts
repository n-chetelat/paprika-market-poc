export { type User, type Product, type Order } from "@prisma/client";
import { Product, Order } from "@prisma/client";

export type OrderWithProduct = Order & {
  product: Product;
};

export type StripeTaxCode = {
  id: string;
  object: string;
  description: string;
  name: string;
  hierarchy_level_0?: string;
  type?: string;
};
