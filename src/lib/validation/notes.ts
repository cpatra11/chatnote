import { title } from "process";
import { z } from "zod";

export const createNotesSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required",
    })
    .max(100),
  content: z.string().optional(),
});
export type CreateNotesSchema = z.infer<typeof createNotesSchema>;

export const updateNotesSchema = createNotesSchema.extend({
  id: z.string().min(1),
});

export const deleteNodeSchema = z.object({
  id: z.string().min(1),
});
