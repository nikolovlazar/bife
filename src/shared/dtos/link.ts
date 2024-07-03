import { z } from 'zod'

export const LinkDTOSchema = z.object({
  fingerprint: z.string(),
  label: z.string(),
  url: z.string(),
  created_by: z.string(),
  created_at: z.string(),
})

export type LinkDTO = z.infer<typeof LinkDTOSchema>
