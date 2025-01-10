import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'

function presenter(collection: Collection) {
  return {
    fingerprint: collection.fingerprint,
    title: collection.title,
    description: collection.description,
    published: collection.published,
    created_by: collection.created_by,
    created_at: collection.created_at,
  }
}

export async function getCollectionController(
  collectionFingerprint: string
): Promise<ReturnType<typeof presenter>> {
  const collection = await getCollectionUseCase(collectionFingerprint)
  if (!collection) {
    throw new NotFoundError(
      `No collection found with fingerprint: ${collectionFingerprint}`
    )
  }

  return presenter(collection)
}
