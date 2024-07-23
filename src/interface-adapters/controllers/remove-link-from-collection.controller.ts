import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { removeLinkFromCollectionUseCase } from '@/application/use-cases/links/remove-link-from-collection.use-case'

import { InputParseError } from '@/entities/errors/common'

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
}
