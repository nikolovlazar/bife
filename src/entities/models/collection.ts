import { z } from 'zod'

export const CollectionSchema = z.object({
  fingerprint: z.string(),
  title: z.string().min(1),
  description: z.string().nullish(),
  published: z.boolean(),
  created_by: z.string(),
  created_at: z.string(),
})

export const CollectionsSchema = z.array(CollectionSchema)

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
