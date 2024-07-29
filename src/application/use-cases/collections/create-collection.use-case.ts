import { nanoid } from 'nanoid'

import { Collection, CollectionInsert } from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function createCollectionUseCase(
  collection: CollectionInsert
): Promise<Collection> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const fingerprint = nanoid(8)

  const collectionsRepository = getInjection('ICollectionsRepository')
  const newCollection = await collectionsRepository.createCollection(
    collection,
    user.id,
    fingerprint
  )

  return newCollection
}
