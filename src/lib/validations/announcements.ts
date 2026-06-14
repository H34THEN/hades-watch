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

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  body: z.string().min(10, "Body must be at least 10 characters").max(10000),
  priority: z.enum(["Low", "Normal", "High", "Critical"]).default("Normal"),
  pinned: z.coerce.boolean().optional().default(false),
  audienceRole: roleEnum.optional().or(z.literal("")).transform((v) => v || undefined),
});

export const announcementUpdateSchema = announcementSchema.extend({
  id: z.string().min(1),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
