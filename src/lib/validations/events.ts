import { z } from "zod";

const roleEnum = z.enum([
  "Owner",
  "Admin",
  "Moderator",
  "Expert",
  "Gamer",
  "Member",
  "Guest",
]);

export const eventSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(10000),
    eventType: z.string().min(1).max(64).default("general"),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().optional(),
    location: z.string().max(500).optional(),
    audienceRole: roleEnum.optional().or(z.literal("")).transform((v) => v || undefined),
    generateJitsi: z.coerce.boolean().optional().default(false),
    jitsiPrefix: z.string().max(32).optional(),
  })
  .refine(
    (data) => {
      if (!data.endsAt) return true;
      return new Date(data.endsAt) >= new Date(data.startsAt);
    },
    { message: "End must be after start", path: ["endsAt"] },
  );

export const eventUpdateSchema = eventSchema.extend({
  id: z.string().min(1),
});

export type EventInput = z.infer<typeof eventSchema>;
