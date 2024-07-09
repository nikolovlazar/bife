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

export const CollectionInsertSchema = CollectionSchema.pick({
  title: true,
  description: true,
})

export type CollectionInsert = z.infer<typeof CollectionInsertSchema>

export const CollectionUpdateSchema = CollectionSchema.pick({
  title: true,
  description: true,
  published: true,
})

export type CollectionUpdate = z.infer<typeof CollectionUpdateSchema>
