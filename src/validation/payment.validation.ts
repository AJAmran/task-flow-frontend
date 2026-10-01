import { z } from "zod";

export const initiatePaymentSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  plan: z.enum(["PRO", "TEAM"], { message: "Choose PRO or TEAM" }),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
