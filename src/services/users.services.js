import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users);
  } catch (e) {
    logger.error("Error getting users", e);
    throw e;
  }
};

export async function getUserById(id) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user.length) {
    throw new Error("User not found");
  }

  return user[0];
}

export async function updateUserById(id, updates) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!existingUser.length) {
    throw new Error("User not found");
  }

  const [updatedUser] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
}

export async function deleteUser(id) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!existingUser.length) {
    throw new Error("User not found");
  }

  await db.delete(users).where(eq(users.id, id));

  return { message: "User deleted successfully" };
}
