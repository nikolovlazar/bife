import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { updateLinksOrderUseCase } from '@/application/use-cases/links/update-links-order.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  UpdateLinksOrderInput,
  updateLinksOrderInputSchema,
} from '../validation-schemas/collections'

export async function updateLinksOrderController(input: UpdateLinksOrderInput) {
  const { data, error: inputParseError } =
    updateLinksOrderInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const collection = await getCollectionUseCase(data.fingerprint)
  await updateLinksOrderUseCase(collection, data.linksOrder)
}
