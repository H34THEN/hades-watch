import { z } from "zod";

export const inviteCodeSchema = z.object({
  code: z
    .string()
    .min(8, "Invite code must be at least 8 characters")
    .max(64, "Invite code is too long")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Invite code may only contain letters, numbers, and hyphens",
    ),
});

export type InviteCodeInput = z.infer<typeof inviteCodeSchema>;
