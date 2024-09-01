import { openDb } from "../database";
import { Product, Review } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function getProduct(productId: string): Promise<Product | null> {
  const db = await openDb();
  const product = await db.get<Product>("SELECT * FROM products WHERE id = ?", [
    productId,
  ]);
  await db.close();
  return product || null;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await openDb();
  const products = await db.all<Product[]>("SELECT * FROM products");
  await db.close();
  return products;
}

export async function addReview(
  userId: string,
  productId: string,
  rating: number,
  comment: string,
): Promise<Review> {
  const db = await openDb();
  const review: Review = { id: uuidv4(), userId, productId, rating, comment };
  await db.run(
    "INSERT INTO reviews (id, userId, productId, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [review.id, review.userId, review.productId, review.rating, review.comment],
  );
  await db.close();
  return review;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const db = await openDb();
  const reviews = await db.all<Review[]>(
    "SELECT * FROM reviews WHERE productId = ?",
    [productId],
  );
  await db.close();
  return reviews;
}
