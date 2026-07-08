import { z } from "zod"

export const AddInventorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  spec: z.string().min(1),
  stock: z.number().int().nonnegative().optional(),
  rules: z
    .object({
      restockThreshold: z.number().int().nonnegative(),
      pricingMode: z.enum(["fixed", "dynamic"]),
    })
    .nullable()
    .optional(),
})

export type AddInventoryBody = z.infer<typeof AddInventorySchema>
