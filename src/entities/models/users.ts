import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  user_metadata: z.object({}),
})

export type User = z.infer<typeof UserSchema>
