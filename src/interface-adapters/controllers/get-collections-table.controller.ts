import dayjs from 'dayjs'

import { getOwnCollectionsUseCase } from '@/application/use-cases/collections/get-own-collections.use-case'

import { Collection } from '@/entities/models/collection'

export type GetCollectionsTableControllerOutput = Pick<
  Collection,
  'fingerprint' | 'title' | 'published' | 'created_at' | 'description'
>[]

function presenter(
  collections: Collection[]
): GetCollectionsTableControllerOutput {
  return collections.map((collection) => ({
    fingerprint: collection.fingerprint,
    title: collection.title,
    published: collection.published,
    created_at: dayjs(collection.created_at).format('MMM D, YYYY'),
    description: collection.description,
  }))
}

export async function getCollectionsTableController(): Promise<GetCollectionsTableControllerOutput> {
  const collections = await getOwnCollectionsUseCase()

  return presenter(collections)
}
