import { z } from "zod";

export const CommandSchema = z.object({
  action: z.string(),
  params: z.record(z.string(), z.any()).optional(),
});

export type CommandInput = z.infer<typeof CommandSchema>;
