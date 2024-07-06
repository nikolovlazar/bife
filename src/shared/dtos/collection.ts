import { z } from 'zod'

export const CollectionSchema = z.object({
  fingerprint: z.string(),
  title: z.string(),
  description: z.string().optional(),
  published: z.boolean(),
  created_by: z.string(),
  created_at: z.string(),
})

export type Collection = z.infer<typeof CollectionSchema>
