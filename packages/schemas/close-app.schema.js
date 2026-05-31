import { z } from "zod";

export const CloseAppSchema = z.object({
  app: z.string().min(1),
});
