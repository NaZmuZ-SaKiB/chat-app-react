import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  gender: z.enum(["male", "female"]),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6),
});

export const userUpdateSchema = z.object({
  email: z.string().email({ message: "Invalid email" }).optional(),
  name: z.string().min(3, "Name must be at least 3 chars.").optional(),
  username: z.string().min(3, "Username must be at least 3 chars.").optional(),
  gender: z.enum(["male", "female"]).optional(),
  image: z.string().url({ message: "Invalid Url" }).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 chars" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 chars" }),
});
