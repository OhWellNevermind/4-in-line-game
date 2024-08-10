import { z } from "zod";

export const loginSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must contain at least 6 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be valid" }),
});
