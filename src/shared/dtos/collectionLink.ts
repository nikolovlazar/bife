import { z } from 'zod'

import { LinkDTOSchema } from './link'

export const CollectionLinkDTOSchema = z.object({
  collection_pk: z.string(),
  link_pk: z.string(),
  order: z.number().min(0),
  visible: z.boolean().default(true),
})

export type CollectionLinkDTO = z.infer<typeof CollectionLinkDTOSchema>

export const CollectionLinksDTOSchema = z.array(
  z.object({
    visible: z.boolean(),
    order: z.number(),
    link: LinkDTOSchema,
  })
)

export type CollectionLinksDTO = z.infer<typeof CollectionLinksDTOSchema>
