import { z } from "zod";

const isoDatetime = (message: string) =>
  z.string({ message }).datetime({ message: "Must be a valid date" });

export const createSprintSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    startDate: isoDatetime("Start date is required"),
    endDate: isoDatetime("End date is required"),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Start date must be before end date",
    path: ["endDate"],
  });

export const updateSprintSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),
    startDate: isoDatetime("Start date must be valid").optional(),
    endDate: isoDatetime("End date must be valid").optional(),
  })
  .refine(
    (data) =>
      data.startDate === undefined ||
      data.endDate === undefined ||
      new Date(data.startDate) < new Date(data.endDate),
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    },
  );

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
