import { z } from 'zod'

export const LinkSchema = z.object({
  fingerprint: z.string(),
  label: z.string(),
  url: z.string(),
  created_by: z.string(),
  created_at: z.string(),
})

export type Link = z.infer<typeof LinkSchema>
