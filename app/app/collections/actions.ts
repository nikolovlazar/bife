'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError } from 'zsa'

import { OperationError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLink } from '@/entities/models/collection-link'

import { getInjection } from '@/di/container'
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
    const collectionsUseCases = getInjection('CollectionsUseCases')

    let collection: Collection

    try {
      collection = await collectionsUseCases.createCollection({
        title: input.title,
        description: input.description,
      })
    } catch (err) {
      // TODO: report err.cause to Sentry
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
    const collectionsUseCases = getInjection('CollectionsUseCases')

    let collection: Collection
    try {
      collection = await collectionsUseCases.updateCollection(
        input.fingerprint,
        input
      )
    } catch (err) {
      // TODO: report err.cause to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', 'Cannot update collection.')
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${collection.fingerprint}`)
    return collection
  })

export const deleteCollection = authenticatedProcedure
  .createServerAction()
  .input(deleteCollectionInputSchema)
  .handler(async ({ input }) => {
    const collectionsUseCases = getInjection('CollectionsUseCases')

    let collection: Collection

    try {
      collection = await collectionsUseCases.deleteCollection(input.fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/app/collections')
    redirect('/app/collections')
  })

export const toggleCollectionPublished = authenticatedProcedure
  .createServerAction()
  .input(toggleCollectionPublishedInputSchema)
  .handler(async ({ input }) => {
    const collectionsUseCases = getInjection('CollectionsUseCases')

    let updatedCollection: Collection

    try {
      updatedCollection = await collectionsUseCases.updateCollection(
        input.fingerprint,
        { published: input.checked }
      )
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
    const collectionLinkUseCases = getInjection('CollectionLinkUseCases')

    let relation: CollectionLink

    try {
      relation = await collectionLinkUseCases.addLinkToCollection(
        input.fingerprint,
        input.linkFingerprint
      )
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${relation.collection_pk}`)
  })

export const removeLinkFromCollection = authenticatedProcedure
  .createServerAction()
  .input(removeLinkFromCollectionInputSchema)
  .handler(async ({ input }) => {
    const collectionLinkUseCases = getInjection('CollectionLinkUseCases')

    let relation: CollectionLink

    try {
      relation = await collectionLinkUseCases.removeLinkFromCollection(
        input.fingerprint,
        input.linkFingerprint
      )
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${relation.collection_pk}`)
    return { message: 'Link removed from collection successfully' }
  })

export const updateLinksOrder = authenticatedProcedure
  .createServerAction()
  .input(updateLinksOrderInputSchema)
  .handler(async ({ input }) => {
    const collectionLinkUseCases = getInjection('CollectionLinkUseCases')

    try {
      await collectionLinkUseCases.updateLinksOrder(
        input.fingerprint,
        input.linksOrder
      )
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${input.fingerprint}`)
  })
