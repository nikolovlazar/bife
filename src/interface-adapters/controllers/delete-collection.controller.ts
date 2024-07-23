import { deleteCollectionUseCase } from '@/application/use-cases/collections/delete-collection.use-case'
import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  DeleteCollectionInput,
  deleteCollectionInputSchema,
} from '../validation-schemas/collections'

export async function deleteCollectionController(input: DeleteCollectionInput) {
  const { data, error: inputParseError } =
    deleteCollectionInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, {
      cause: inputParseError,
    })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  await deleteCollectionUseCase(collection)
}
