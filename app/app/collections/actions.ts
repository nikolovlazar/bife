'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError } from 'zsa'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { deleteCollectionUseCase } from '@/application/use-cases/collections/delete-collection.use-case'
import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { updateCollectionUseCase } from '@/application/use-cases/collections/update-collection.use-case'
import { addLinkToCollectionUseCase } from '@/application/use-cases/links/add-link-to-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { removeLinkFromCollectionUseCase } from '@/application/use-cases/links/remove-link-from-collection.use-case'
import { updateLinksOrderUseCase } from '@/application/use-cases/links/update-links-order.use-case'

import { UnauthorizedError } from '@/entities/errors/auth'
import { NotFoundError, OperationError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import {
  addLinkToCollectionInputSchema,
  createCollectionInputSchema,
  deleteCollectionInputSchema,
  removeLinkFromCollectionInputSchema,
  toggleCollectionPublishedInputSchema,
  updateCollectionInputSchema,
  updateLinksOrderInputSchema,
} from '@/web/_lib/validation-schemas/collections'
import { authenticatedProcedure } from '@/web/_lib/zsa-procedures'

export const createCollection = authenticatedProcedure
  .createServerAction()
  .input(createCollectionInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection

    try {
      collection = await createCollectionUseCase({
        title: input.title,
        description: input.description,
      })
    } catch (err) {
      // TODO: report err.cause to Sentry
      // actually don't - errors should be reported to Sentry at the moment they happen
      // we shouldn't report rethrown errors
      // we should just let the client know that an error happened
      if (err instanceof OperationError) {
        throw new ZSAError(
          'ERROR',
          'Cannot create collection. Reason: ' + err.message
        )
      }
      throw new ZSAError('ERROR', err)
    }

    redirect(`/app/collections/${collection.fingerprint}`)
  })

export const updateCollection = authenticatedProcedure
  .createServerAction()
  .input(updateCollectionInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection

    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new ZSAError('ERROR', 'Collection does not exist.')
      }
      throw new ZSAError('ERROR', err)
    }

    let updatedCollection: Collection
    try {
      updatedCollection = await updateCollectionUseCase(collection, input)
    } catch (err) {
      // TODO: report err.cause to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', 'Cannot update collection.')
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${updatedCollection.fingerprint}`)
    return updatedCollection
  })

export const deleteCollection = authenticatedProcedure
  .createServerAction()
  .input(deleteCollectionInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection

    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new ZSAError('ERROR', 'Collection does not exist')
      }
      throw new ZSAError('ERROR', err)
    }

    try {
      collection = await deleteCollectionUseCase(collection)
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        throw new ZSAError(
          'NOT_AUTHORIZED',
          'Not authorized to delete this collection'
        )
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/app/collections')
    redirect('/app/collections')
  })

export const toggleCollectionPublished = authenticatedProcedure
  .createServerAction()
  .input(toggleCollectionPublishedInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection
    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new ZSAError('ERROR', 'Could not find collection.')
      }
      throw new ZSAError('ERROR', err)
    }

    let updatedCollection: Collection

    try {
      updatedCollection = await updateCollectionUseCase(collection, {
        published: input.checked,
      })
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError(
        'ERROR',
        `Cannot ${input.checked ? 'publish' : 'unpublish'} collection`
      )
    }

    revalidatePath(`/app/collections/${updatedCollection.fingerprint}`)
    return updatedCollection
  })

export const addLinkToCollection = authenticatedProcedure
  .createServerAction()
  .input(addLinkToCollectionInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection

    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    let link: Link

    try {
      link = await getLinkUseCase(input.linkFingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    try {
      await addLinkToCollectionUseCase(link, collection)
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${collection.fingerprint}`)
  })

export const removeLinkFromCollection = authenticatedProcedure
  .createServerAction()
  .input(removeLinkFromCollectionInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection

    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    let link: Link

    try {
      link = await getLinkUseCase(input.linkFingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    try {
      await removeLinkFromCollectionUseCase(link, collection)
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${collection.fingerprint}`)
    revalidatePath(`/${collection.fingerprint}`)
    return { message: 'Link removed from collection successfully' }
  })

export const updateLinksOrder = authenticatedProcedure
  .createServerAction()
  .input(updateLinksOrderInputSchema)
  .handler(async ({ input }) => {
    let collection: Collection
    try {
      collection = await getCollectionUseCase(input.fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    try {
      await updateLinksOrderUseCase(collection, input.linksOrder)
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${collection.fingerprint}`)
    revalidatePath(`/${collection.fingerprint}`)
  })
