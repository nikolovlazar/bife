import { z } from 'zod'

export const getByFingerprintInputSchema = z.object({
  fingerprint: z.string(),
})

export type GetByFingerprintInput = z.infer<typeof getByFingerprintInputSchema>
