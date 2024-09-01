import { openDb } from "../database";
import { Product } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function addProduct(
  vendorId: string,
  name: string,
  description: string,
  price: number,
  stock: number,
): Promise<Product> {
  const db = await openDb();
  const product: Product = {
    id: uuidv4(),
    vendorId,
    name,
    description,
    price,
    stock,
  };
  await db.run(
    "INSERT INTO products (id, vendorId, name, description, price, stock) VALUES (?, ?, ?, ?, ?, ?)",
    [
      product.id,
      product.vendorId,
      product.name,
      product.description,
      product.price,
      product.stock,
    ],
  );
  await db.close();
  return product;
}

export async function updateProduct(
  productId: string,
  name: string,
  description: string,
  price: number,
  stock: number,
): Promise<Product | null> {
  const db = await openDb();
  await db.run(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?",
    [name, description, price, stock, productId],
  );
  const updatedProduct = await db.get<Product>(
    "SELECT * FROM products WHERE id = ?",
    [productId],
  );
  await db.close();
  return updatedProduct || null;
}

export async function getVendorProducts(vendorId: string): Promise<Product[]> {
  const db = await openDb();
  const products = await db.all<Product[]>(
    "SELECT * FROM products WHERE vendorId = ?",
    [vendorId],
  );
  await db.close();
  return products;
}
