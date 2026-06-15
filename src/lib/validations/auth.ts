import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(2, "Enter your email or operative codename")
    .max(256),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Enter a valid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
    inviteCode: z
      .string()
      .min(8, "Invite code is required")
      .max(64, "Invite code is too long"),
    name: z
      .string()
      .min(2, "Operative codename is required")
      .max(64, "Codename is too long"),
    verificationValue: z.string().max(4096).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
