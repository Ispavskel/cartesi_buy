import { v4 as uuidv4 } from "uuid";
import { openDb } from "../database";
import { User } from "../types";

export async function registerUser(
  name: string,
  email: string,
  type: "customer" | "vendor",
): Promise<User> {
  const db = await openDb();
  const user: User = { id: uuidv4(), name, email, type };
  await db.run(
    "INSERT INTO users (id, name, email, type) VALUES (?, ?, ?, ?)",
    [user.id, user.name, user.email, user.type],
  );
  await db.close();
  return user;
}

export async function getUser(userId: string): Promise<User | null> {
  const db = await openDb();
  const user = await db.get<User>("SELECT * FROM users WHERE id = ?", [userId]);
  await db.close();
  return user || null;
}

export async function updateUser(
  userId: string,
  name: string,
  email: string,
): Promise<User | null> {
  const db = await openDb();
  await db.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name,
    email,
    userId,
  ]);
  const updatedUser = await getUser(userId);
  await db.close();
  return updatedUser;
}
