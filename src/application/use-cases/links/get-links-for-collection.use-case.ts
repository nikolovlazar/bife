import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'
import { User } from '@/entities/models/users'

import { getInjection } from '@/di/container'

export async function getLinksForCollectionUseCase(
  collection: Collection
): Promise<CollectionLinks> {
  const authenticationService = getInjection('IAuthenticationService')
  let user: User
  let shouldFilterInvisibleLinks = true

  try {
    user = await authenticationService.getUser()
    shouldFilterInvisibleLinks = collection.created_by !== user.id
  } catch (err) {}

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')
  const links = await collectionLinkRepository.getLinksForCollection(
    collection.fingerprint
  )

  let displayedLinks = links

  if (shouldFilterInvisibleLinks) {
    displayedLinks = links.filter((link) => link.visible)
  }

  return displayedLinks.sort((a, b) => a.order - b.order)
}
