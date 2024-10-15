import dayjs from 'dayjs'

import { getOwnCollectionsUseCase } from '@/application/use-cases/collections/get-own-collections.use-case'

import { Collection } from '@/entities/models/collection'

export type GetCollectionsTableControllerOutput = {
  data: Pick<
    Collection,
    'fingerprint' | 'title' | 'published' | 'created_at' | 'description'
  >[]
  totalCount: number
}

function presenter(
  collections: Collection[],
  totalCount: number
): GetCollectionsTableControllerOutput {
  return {
    data: collections.map((collection) => ({
      fingerprint: collection.fingerprint,
      title: collection.title,
      published: collection.published,
      created_at: dayjs(collection.created_at).format('MMM D, YYYY'),
      description: collection.description,
    })),
    totalCount,
  }
}

export async function getCollectionsTableController(
  page: number = 1,
  pageSize: number = 10
): Promise<GetCollectionsTableControllerOutput> {
  const { collections, totalCount } = await getOwnCollectionsUseCase(
    page,
    pageSize
  )

  return presenter(collections, totalCount)
}
