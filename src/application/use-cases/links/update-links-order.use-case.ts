import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'

import { getInjection } from '@/di/container'

export async function updateLinksOrderUseCase(
  collection: Collection,
  linksOrder: { fingerprint: string; order: number }[]
): Promise<void> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (collection.created_by !== user.id) {
    throw new UnauthorizedError(
      'Cannot update links order. Reason: unauthorized'
    )
  }

  const linksRepository = getInjection('ILinksRepository')
  const links = await Promise.all(
    linksOrder.map((link) => linksRepository.getLink(link.fingerprint))
  )

  if (links.some((link) => link.created_by !== user.id)) {
    throw new UnauthorizedError(
      'Cannot update links order. Reason: unauthorized'
    )
  }

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')
  await collectionLinkRepository.updateLinksOrder(
    collection.fingerprint,
    linksOrder
  )
}
