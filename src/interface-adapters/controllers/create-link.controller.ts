import dayjs from 'dayjs'

import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { addLinkToCollectionUseCase } from '@/application/use-cases/links/add-link-to-collection.use-case'
import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { InputParseError } from '@/entities/errors/common'
import { Link } from '@/entities/models/link'

import {
  CreateLinkInput,
  createLinkInputSchema,
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

export async function createLinkController(
  input: CreateLinkInput
): Promise<ReturnType<typeof presenter>> {
  const { data, error: inputParseError } =
    createLinkInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const { collectionFingerprint, ...linkInput } = data

  const link = await createLinkUseCase(linkInput)

  if (collectionFingerprint) {
    const collection = await getCollectionUseCase(collectionFingerprint)
    await addLinkToCollectionUseCase(link, collection)
  }

  return presenter(link)
}
