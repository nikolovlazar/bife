import dayjs from 'dayjs'

import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { updateLinkUseCase } from '@/application/use-cases/links/update-link.use-case'

import { InputParseError } from '@/entities/errors/common'
import { Link } from '@/entities/models/link'

import {
  UpdateLinkInput,
  updateLinkInputSchema,
} from '../validation-schemas/links'

function presenter(link: Link) {
  return {
    fingerprint: link.fingerprint,
    url: link.url,
    label: link.label,
    created_by: link.created_by,
    created_at: dayjs(link.created_at).format('MMM D, YYYY'),
  }
}

export async function updateLinkController(
  input: UpdateLinkInput
): Promise<ReturnType<typeof presenter>> {
  const { data, error: inputParseError } =
    updateLinkInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const link = await getLinkUseCase(data.fingerprint)
  const updated = await updateLinkUseCase(link, data)

  return presenter(updated)
}
