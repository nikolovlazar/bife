import { Collection } from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function getCollectionUseCase(
  fingerprint: string
): Promise<Collection> {
  const collectionsRepository = getInjection('ICollectionsRepository')
  const collection = await collectionsRepository.getCollection(fingerprint)

  const cacheService = getInjection('ICacheService')
  await cacheService.setCachedCollection(fingerprint, collection)

  return collection
}
