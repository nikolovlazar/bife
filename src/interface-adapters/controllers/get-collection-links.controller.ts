import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { NotFoundError } from '@/entities/errors/common'
import { CollectionLinks } from '@/entities/models/collection-link'

export type GetCollectionLinksControllerOutput = {
  links: CollectionLinks
}

function presenter(links: CollectionLinks): GetCollectionLinksControllerOutput {
  return {
    links: links.map((link) => ({
      link: link.link,
      visible: link.visible,
      order: link.order,
    })),
  }
}

export async function getCollectionLinksController(
  collectionFingerprint: string
): Promise<GetCollectionLinksControllerOutput> {
  const collection = await getCollectionUseCase(collectionFingerprint)
  if (!collection) {
    throw new NotFoundError(
      `No collection found with fingerprint: ${collectionFingerprint}`
    )
  }

  const collectionLinks = await getLinksForCollectionUseCase(collection)

  return presenter(collectionLinks)
}
