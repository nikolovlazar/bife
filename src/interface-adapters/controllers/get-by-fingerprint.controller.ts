import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getByFingerprintCached } from '@/application/use-cases/general/get-by-fingerprint-cached.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { InputParseError, NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'
import { Link } from '@/entities/models/link'

import {
  GetByFingerprintInput,
  getByFingerprintInputSchema,
} from '@/interface-adapters/validation-schemas/common'

type PresenterInput =
  | { link: Link; displayLinks?: undefined; collection?: undefined }
  | { link?: undefined; displayLinks: CollectionLinks; collection: Collection }

function presenter(input: PresenterInput) {
  if (input.link) {
    return {
      link: {
        fingerprint: input.link.fingerprint,
        label: input.link.label,
        url: input.link.url,
      },
    }
  }

  return {
    collection: input.collection,
    displayLinks: input.displayLinks.map((dl) => ({
      visible: dl.visible,
      order: dl.order,
      link: {
        fingerprint: dl.link.fingerprint,
        label: dl.link.label,
        url: dl.link.url,
        created_at: dl.link.created_at,
        created_by: dl.link.created_by,
      },
    })),
  }
}

export async function getByFingerprintController(input: GetByFingerprintInput) {
  const { data, error: inputParseError } =
    getByFingerprintInputSchema.safeParse(input)

  if (inputParseError) {
    throw new InputParseError(inputParseError.name, { cause: inputParseError })
  }

  const { fingerprint } = data

  let link: Link
  let collection: Collection

  const cached = await getByFingerprintCached(fingerprint)

  if (cached) {
    if (cached.link) {
      link = cached.link
      return presenter({ link })
    } else if (cached.collection) {
      collection = cached.collection
      return returnCollectionWithDisplayLinks(collection)
    }
  }

  try {
    link = await getLinkUseCase(fingerprint)
    return presenter({ link })
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }

  try {
    collection = await getCollectionUseCase(fingerprint)
    return returnCollectionWithDisplayLinks(collection)
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new NotFoundError(
        'No resource has been found with that fingerprint'
      )
    }
    throw err
  }
}

async function returnCollectionWithDisplayLinks(collection: Collection) {
  try {
    const displayLinks = await getLinksForCollectionUseCase(collection)
    return presenter({ collection, displayLinks })
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }
}
