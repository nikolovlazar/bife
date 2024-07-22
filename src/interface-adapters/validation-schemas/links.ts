import { z } from 'zod'

export const createLinkInputSchema = z.object({
  collectionFingerprint: z.string().optional(),
  url: z.string().min(6),
  label: z.string().min(1),
})

export const updateLinkInputSchema = z.object({
  fingerprint: z.string(),
  url: z.string(),
  label: z.string(),
})

export const deleteLinkInputSchema = z.object({
  fingerprint: z.string(),
})

export const toggleLinkVisibilityInputSchema = z.object({
  link_pk: z.string(),
  collection_pk: z.string(),
  checked: z.boolean(),
})
