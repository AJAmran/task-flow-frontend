import { z } from "zod";
import { isDateOnly } from "@/lib/date";

const optionalDateOnly = z
  .string()
  .refine(
    (value) =>
      value === "" ||
      (isDateOnly(value) && !Number.isNaN(new Date(value).getTime())),
    { message: "Must be a valid date" },
  )
  .optional();

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional()
      .or(z.literal("")),
    startDate: optionalDateOnly,
    endDate: optionalDateOnly,
    teamId: z.string().uuid("Select a valid team").optional().or(z.literal("")),
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate).getTime() < new Date(data.endDate).getTime(),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export const updateProjectSchema = z

  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
    startDate: optionalDateOnly,
    endDate: optionalDateOnly,
    teamId: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      new Date(data.startDate).getTime() < new Date(data.endDate).getTime(),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export const addProjectMemberSchema = z.object({
  userId: z.string().min(1, "Select a member"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
