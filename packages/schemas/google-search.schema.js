import { z } from "zod";

export const GoogleSearchSchema = z.object({
  query: z.string().min(1),
});
