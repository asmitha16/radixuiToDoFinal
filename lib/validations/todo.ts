import * as z from "zod"

export const todoPatchSchema = z.object({
  complete: z.boolean(),
})

