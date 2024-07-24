import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { updateLinkVisibilityUseCase } from '@/application/use-cases/links/update-link-visibility.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  ToggleLinkVisibilityInput,
  toggleLinkVisibilityInputSchema,
} from '../validation-schemas/links'

export async function toggleLinkVisibilityController(
  input: ToggleLinkVisibilityInput
): Promise<void> {
  const { data, error: inputParseError } =
    toggleLinkVisibilityInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const link = await getLinkUseCase(data.link_pk)
  const collection = await getCollectionUseCase(data.collection_pk)
  await updateLinkVisibilityUseCase(link, collection, data.checked)
}
