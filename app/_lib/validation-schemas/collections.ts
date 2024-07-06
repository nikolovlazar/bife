import { z } from 'zod'

export const createCollectionInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export const updateCollectionInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fingerprint: z.string(),
  published: z.boolean(),
})

export const deleteCollectionInputSchema = z.object({
  fingerprint: z.string(),
})

export const toggleCollectionPublishedInputSchema = z.object({
  fingerprint: z.string(),
  checked: z.boolean(),
})

export const addLinkToCollectionInputSchema = z.object({
  linkFingerprint: z.string(),
  fingerprint: z.string(),
})

export const removeLinkFromCollectionInputSchema = z.object({
  linkFingerprint: z.string(),
  fingerprint: z.string(),
})

export const updateLinksOrderInputSchema = z.object({
  fingerprint: z.string(),
  linksOrder: z.array(
    z.object({
      fingerprint: z.string(),
      order: z.number(),
    })
  ),
})
