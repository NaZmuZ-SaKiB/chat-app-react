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
