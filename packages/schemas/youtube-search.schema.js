import { z } from "zod";

export const YoutubeSearchSchema = z.object({
  query: z.string().min(1),
});
