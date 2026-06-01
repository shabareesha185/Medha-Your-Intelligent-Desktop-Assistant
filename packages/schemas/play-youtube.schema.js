import { z } from "zod";

export const PlayYoutubeSchema = z.object({
  query: z.string().min(1).max(200),
});
