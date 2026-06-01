import { z } from "zod";
import { ALLOWED_ACTIONS } from "../config/allowed-actions.js";

export const CommandSchema = z.object({
  action: z.enum(ALLOWED_ACTIONS),
  params: z.object({}).passthrough(),
});
