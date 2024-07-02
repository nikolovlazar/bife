import type { Tables } from '~/supabase/types.gen'

export type Link = Tables<'link'>

export type Collection = Pick<
  Tables<'collection'>,
  'title' | 'published' | 'fingerprint' | 'created_at' | 'created_by'
> & { description: string | undefined | null }
export type CollectionInsert = Pick<Collection, 'title' | 'description'>
export type CollectionUpdate = Pick<
  Collection,
  'title' | 'description' | 'published' | 'published'
>
