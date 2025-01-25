import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function deleteCollectionUseCase(
  collection: Collection
): Promise<Collection> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot delete collection. Reason: unauthorized.'
    )
  }

  const collectionsRepository = getInjection('ICollectionsRepository')
  const deletedCollection = await collectionsRepository.deleteCollection(
    collection.fingerprint
  )

  const cacheService = getInjection('ICacheService')
  await cacheService.deleteCachedValue(collection.fingerprint)

  return deletedCollection
}
