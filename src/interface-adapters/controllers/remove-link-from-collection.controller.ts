import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'
import { removeLinkFromCollectionUseCase } from '@/application/use-cases/links/remove-link-from-collection.use-case'
import { updateLinksOrderUseCase } from '@/application/use-cases/links/update-links-order.use-case'

import { InputParseError } from '@/entities/errors/common'
import { CollectionLinks } from '@/entities/models/collection-link'

import {
  RemoveLinkFromCollectionInput,
  removeLinkFromCollectionInputSchema,
} from '../validation-schemas/collections'

export async function removeLinkFromCollectionController(
  input: RemoveLinkFromCollectionInput
) {
  const { data, error: inputParseError } =
    removeLinkFromCollectionInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  const link = await getLinkUseCase(data.linkFingerprint)
  await removeLinkFromCollectionUseCase(link, collection)

  let existingLinks: CollectionLinks = []

  try {
    existingLinks = await getLinksForCollectionUseCase(collection)
  } catch (err) {}

  await updateLinksOrderUseCase(
    collection,
    existingLinks.map((el, i) => ({
      fingerprint: el.link.fingerprint,
      order: i + 1,
    }))
  )
}
