import type { Tables } from '~/supabase/types.gen'

export type Link = Pick<
  Tables<'link'>,
  'fingerprint' | 'label' | 'url' | 'created_by' | 'created_at'
>
export type LinkInsert = Pick<Link, 'label' | 'url'>
export type LinkUpdate = Pick<Link, 'label' | 'url'>

export type Collection = Pick<
  Tables<'collection'>,
  'title' | 'published' | 'fingerprint' | 'created_at' | 'created_by'
> & { description: string | undefined | null }
export type CollectionInsert = Pick<Collection, 'title' | 'description'>
export type CollectionUpdate = Pick<
  Collection,
  'title' | 'description' | 'published' | 'published'
>

export type CollectionLink = Pick<
  Tables<'collection_link'>,
  'collection_pk' | 'link_pk' | 'order' | 'visible'
>
