import { Collection } from '@/entities/models/collection'

import { getInjection } from '@/di/container'

export async function getCollectionUseCase(
  fingerprint: string
): Promise<Collection> {
  const collectionsRepository = getInjection('ICollectionsRepository')
  const collection = await collectionsRepository.getCollection(fingerprint)

  return collection
}
