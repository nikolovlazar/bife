import { z } from 'zod'

export const LinkSchema = z.object({
  fingerprint: z.string(),
  label: z.string(),
  url: z.string(),
  created_by: z.string(),
  created_at: z.string(),
})

export type Link = z.infer<typeof LinkSchema>

export const LinksSchema = z.array(LinkSchema)

export const LinkInsertSchema = LinkSchema.pick({
  label: true,
  url: true,
})

export type LinkInsert = z.infer<typeof LinkInsertSchema>

export const LinkUpdateSchema = LinkSchema.pick({
  label: true,
  url: true,
})

export type LinkUpdate = z.infer<typeof LinkUpdateSchema>
