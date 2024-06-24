import { z } from 'zod'

export const createLinkSchema = z.object({
  collection: z.string().optional(),
  url: z.string().min(6),
  label: z.string().min(1),
})

export const updateLinkSchema = z.object({
  fingerprint: z.string(),
  url: z.string(),
  label: z.string(),
})

export const deleteLinkSchema = z.object({
  fingerprint: z.string(),
})

export const toggleLinkVisibilitySchema = z.object({
  link_pk: z.string(),
  collection_pk: z.string(),
  checked: z.boolean(),
})
