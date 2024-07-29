import { UnauthorizedError } from '@/entities/errors/auth'
import {
  Collection,
  CollectionUpdate,
  CollectionUpdateSchema,
} from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function updateCollectionUseCase(
  collection: Collection,
  input: Partial<CollectionUpdate>
): Promise<Collection> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot update collection. Reason: unauthorized.'
    )
  }

  const newData = CollectionUpdateSchema.parse({
    title: input.title ?? collection.title,
    description: input.description ?? collection.description,
    published: input.published ?? collection.published,
  })

  const collectionsRepository = getInjection('ICollectionsRepository')
  const updatedCollection = await collectionsRepository.updateCollection(
    collection.fingerprint,
    newData
  )

  return updatedCollection
}
