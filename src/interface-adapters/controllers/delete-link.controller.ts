import { deleteLinkUseCase } from '@/application/use-cases/links/delete-link.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'

import { InputParseError } from '@/entities/errors/common'

import {
  DeleteLinkInput,
  deleteLinkInputSchema,
} from '../validation-schemas/links'

export async function deleteLinkController(
  input: DeleteLinkInput
): Promise<void> {
  const { data, error: inputParseError } =
    deleteLinkInputSchema.safeParse(input)

  if (inputParseError) {
    // TODO: Report this to Sentry
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const link = await getLinkUseCase(data.fingerprint)
  await deleteLinkUseCase(link)
}
