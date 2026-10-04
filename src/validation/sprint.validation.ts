import { z } from "zod";
import { isDateOnly } from "@/lib/date";

const dateOnly = (message: string) =>
  z
    .string({ message })
    .refine(
      (value) => isDateOnly(value) && !Number.isNaN(new Date(value).getTime()),
      {
        message: "Must be a valid date",
      },
    );

export const createSprintSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name cannot exceed 100 characters"),
    startDate: dateOnly("Start date is required"),
    endDate: dateOnly("End date is required"),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
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
    startDate: dateOnly("Start date must be valid").optional(),
    endDate: dateOnly("End date must be valid").optional(),
  })
  .refine(
    (data) =>
      data.startDate === undefined ||
      data.endDate === undefined ||
      new Date(data.startDate) < new Date(data.endDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

export type CreateSprintInput = z.infer<typeof createSprintSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintSchema>;
