import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1)
    .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Username can contain only letters, digits and underscore",
    }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must contain at least 6 characters" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be valid" }),
});
