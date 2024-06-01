import { Database } from '~/supabase/types.gen'

export type Link = Database['public']['Tables']['link']['Row']
export type Collection = Database['public']['Tables']['collection']['Row']
export type LinkWithVisibility = { visible: boolean; link: Link }
export type GenericFormState = {
  message?: string
  error?: string
}
