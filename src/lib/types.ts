export { type User, type Product, type Order } from "@prisma/client";
import { Product, Order } from "@prisma/client";

export type OrderWithProduct = Order & {
  product: Product;
};
