import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.email().max(255).toLowerCase().trim(),
  password: z.string().min(6).max(255),
  role: z.enum(["user", "admin"]).default("user"),
});

export const signInSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive("Invalid user ID format"),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.email().toLowerCase().trim().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["user", "admin"]).optional(),
});
