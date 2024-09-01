import { openDb } from "../database";
import { Order, Product } from "../types";
import { v4 as uuidv4 } from "uuid";

export async function createOrder(
  userId: string,
  productId: string,
  quantity: number,
): Promise<Order | null> {
  const db = await openDb();
  const product = await db.get<Product>("SELECT * FROM products WHERE id = ?", [
    productId,
  ]);
  if (!product || product.stock < quantity) {
    await db.close();
    return null;
  }

  const order: Order = {
    id: uuidv4(),
    userId,
    productId,
    quantity,
    status: "pending",
  };
  await db.run(
    "INSERT INTO orders (id, userId, productId, quantity, status) VALUES (?, ?, ?, ?, ?)",
    [order.id, order.userId, order.productId, order.quantity, order.status],
  );

  await db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [
    quantity,
    productId,
  ]);

  await db.close();
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: "shipped" | "delivered" | "cancelled",
): Promise<Order | null> {
  const db = await openDb();
  await db.run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
  const updatedOrder = await db.get<Order>(
    "SELECT * FROM orders WHERE id = ?",
    [orderId],
  );
  await db.close();
  return updatedOrder || null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const db = await openDb();
  const orders = await db.all<Order[]>(
    "SELECT * FROM orders WHERE userId = ?",
    [userId],
  );
  await db.close();
  return orders;
}
