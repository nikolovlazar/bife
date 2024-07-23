import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { addLinkToCollectionUseCase } from '@/application/use-cases/links/add-link-to-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  AddLinkToCollectionInput,
  addLinkToCollectionInputSchema,
} from '../validation-schemas/collections'

export async function addLinkToCollectionController(
  input: AddLinkToCollectionInput
) {
  const { data, error: inputParseError } =
    addLinkToCollectionInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  const link = await getLinkUseCase(data.linkFingerprint)

  await addLinkToCollectionUseCase(link, collection)
}
