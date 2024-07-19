import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function removeLinkFromCollectionUseCase(
  link: Link,
  collection: Collection
): Promise<void> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (link.created_by !== user.id || collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot remove link from collection. Reason: unauthorized'
    )
  }

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')
  await collectionLinkRepository.removeLinkFromCollection(
    collection.fingerprint,
    link.fingerprint
  )
}
