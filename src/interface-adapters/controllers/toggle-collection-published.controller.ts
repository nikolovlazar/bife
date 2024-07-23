import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { updateCollectionUseCase } from '@/application/use-cases/collections/update-collection.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  ToggleCollectionPublishedInput,
  toggleCollectionPublishedInputSchema,
} from '../validation-schemas/collections'

export async function toggleCollectionPublishedController(
  input: ToggleCollectionPublishedInput
) {
  const { data, error: inputParseError } =
    toggleCollectionPublishedInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  await updateCollectionUseCase(collection, { published: data.checked })
}
