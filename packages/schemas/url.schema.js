import { z } from "zod";
import { ALLOWED_PROTOCOLS } from "../config/allowed-protocols.js";

export const UrlSchema = z
  .object({
    url: z.string().url(),
  })
  .refine(
    (data) => {
      const protocol = new URL(data.url).protocol;

      return ALLOWED_PROTOCOLS.includes(protocol);
    },
    {
      message: "Only http and https URLs are allowed",
    },
  );
