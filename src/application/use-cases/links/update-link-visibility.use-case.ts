import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import { getInjection } from '~/di/container'

export async function updateLinkVisibilityUseCase(
  link: Link,
  collection: Collection,
  visibility: boolean
): Promise<void> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (link.created_by !== user.id || collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot update link visibility. Reason: unauthorized'
    )
  }

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')
  await collectionLinkRepository.setVisibility(
    collection.fingerprint,
    link.fingerprint,
    visibility
  )
}
