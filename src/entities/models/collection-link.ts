import { LinkSchema } from './link'
import { z } from 'zod'

export const CollectionLinkSchema = z.object({
  collection_pk: z.string(),
  link_pk: z.string(),
  order: z.number().min(0),
  visible: z.boolean().default(true),
})

export type CollectionLink = z.infer<typeof CollectionLinkSchema>

export const CollectionLinksSchema = z.array(
  z.object({
    visible: z.boolean(),
    order: z.number(),
    link: LinkSchema,
  })
)

export type CollectionLinks = z.infer<typeof CollectionLinksSchema>
