import { z } from 'zod'

export const createCollectionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export const updateCollectionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  published: z.boolean(),
  fingerprint: z.string(),
})

export const deleteCollectionSchema = z.object({
  fingerprint: z.string(),
})

export const toggleCollectionPublishedSchema = z.object({
  fingerprint: z.string(),
  checked: z.boolean(),
})

export const addLinkToCollectionSchema = z.object({
  linkFingerprint: z.string(),
  collectionFingerprint: z.string(),
})

export const removeLinkFromCollectionSchema = z.object({
  linkFingerprint: z.string(),
  collectionFingerprint: z.string(),
})

export const updateLinksOrderSchema = z.object({
  collectionFingerprint: z.string(),
  linksOrder: z.array(
    z.object({
      fingerprint: z.string(),
      order: z.number(),
    })
  ),
})
