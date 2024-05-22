import { Database } from '~/supabase/types.gen'

export type Link = Database['public']['Tables']['link']['Row']
export type Collection = Database['public']['Tables']['collection']['Row']
