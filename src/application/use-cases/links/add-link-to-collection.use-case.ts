import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function addLinkToCollectionUseCase(
  link: Link,
  collection: Collection
): Promise<void> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (link.created_by !== user.id || collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot add link to collection. Reason: Unauthorized'
    )
  }

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')

  let numExistingLinks = 0

  try {
    const existingLinks = await collectionLinkRepository.getLinksForCollection(
      collection.fingerprint
    )
    numExistingLinks = existingLinks.length
  } catch (err) {}

  await collectionLinkRepository.addLinkToCollection(
    collection.fingerprint,
    link.fingerprint,
    numExistingLinks + 1
  )
}
