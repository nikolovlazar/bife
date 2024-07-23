import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { updateCollectionUseCase } from '@/application/use-cases/collections/update-collection.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  UpdateCollectionInput,
  updateCollectionInputSchema,
} from '../validation-schemas/collections'

export async function updateCollectionController(
  input: UpdateCollectionInput
): Promise<void> {
  const { data, error: inputParseError } =
    updateCollectionInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  await updateCollectionUseCase(collection, data)
}
