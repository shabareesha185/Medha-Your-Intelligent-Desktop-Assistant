import { z } from "zod";

export const OpenAppSchema = z.object({
  app: z.string().min(1),
});

// import { z } from "zod";

// export const OpenAppSchema = z.object({
//   app: z.enum([
//     "chrome",
//     "vscode",
//     "spotify"
//   ])
// });
