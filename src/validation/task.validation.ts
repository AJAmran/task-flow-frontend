import { z } from "zod";

const isoDatetime = (message: string) =>
  z.string({ message }).datetime({ message: "Must be a valid date" });

const NO_SELECT = "__none__";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional()
    .or(z.literal("")),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  sprintId: z.string().optional().or(z.literal("")),
  assigneeId: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  sprintId: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
});

export const subtaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Write something first")
    .max(2000, "Comment cannot exceed 2000 characters"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type SubtaskInput = z.infer<typeof subtaskSchema>;
export type CommentInput = z.infer<typeof commentSchema>;

export { NO_SELECT };
