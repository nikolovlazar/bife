import { z } from 'zod'

export const createCollectionInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export type CreateCollectionInput = z.infer<typeof createCollectionInputSchema>

export const updateCollectionInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fingerprint: z.string(),
  published: z.boolean(),
})

export type UpdateCollectionInput = z.infer<typeof updateCollectionInputSchema>

export const deleteCollectionInputSchema = z.object({
  fingerprint: z.string(),
})

export type DeleteCollectionInput = z.infer<typeof deleteCollectionInputSchema>

export const toggleCollectionPublishedInputSchema = z.object({
  fingerprint: z.string(),
  checked: z.boolean(),
})

export type ToggleCollectionPublishedInput = z.infer<
  typeof toggleCollectionPublishedInputSchema
>

export const addLinkToCollectionInputSchema = z.object({
  linkFingerprint: z.string(),
  fingerprint: z.string(),
})

export type AddLinkToCollectionInput = z.infer<
  typeof addLinkToCollectionInputSchema
>

export const removeLinkFromCollectionInputSchema = z.object({
  linkFingerprint: z.string(),
  fingerprint: z.string(),
})

export type RemoveLinkFromCollectionInput = z.infer<
  typeof removeLinkFromCollectionInputSchema
>

export const updateLinksOrderInputSchema = z.object({
  fingerprint: z.string(),
  linksOrder: z.array(
    z.object({
      fingerprint: z.string(),
      order: z.number(),
    })
  ),
})

export type UpdateLinksOrderInput = z.infer<typeof updateLinksOrderInputSchema>
