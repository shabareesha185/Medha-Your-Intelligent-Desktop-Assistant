import { z } from "zod";

export const CommandSchema = z.object({
  action: z.string(),
  params: z.object({}).passthrough(),
});
