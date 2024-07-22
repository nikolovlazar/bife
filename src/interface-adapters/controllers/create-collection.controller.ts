import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'

import { InputParseError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'

import { createCollectionInputSchema } from '@/interface-adapters/validation-schemas/collections'

function presenter(collection: Collection) {
  return {
    fingerprint: collection.fingerprint,
  }
}

export type CreateCollectionControllerOutput = ReturnType<typeof presenter>

export async function createCollectionController(
  input: any
): Promise<CreateCollectionControllerOutput> {
  const { data, error: inputParseError } =
    createCollectionInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await createCollectionUseCase(data)

  return presenter(collection)
}
