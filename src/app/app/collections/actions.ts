'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ZSAError } from 'zsa'

import {
  addLinkToCollectionInputSchema,
  createCollectionInputSchema,
  deleteCollectionInputSchema,
  removeLinkFromCollectionInputSchema,
  toggleCollectionPublishedInputSchema,
  updateCollectionInputSchema,
  updateLinksOrderInputSchema,
} from '@/app/_lib/validation-schemas/collections'
import { authenticatedProcedure } from '@/app/_lib/zsa-procedures'

import { ServiceLocator } from '@/services/serviceLocator'
import { CollectionDTO } from '@/shared/dtos/collection'
import { CreateCollectionError, UpdateCollectionError } from '@/shared/errors/collectionErrors'
import { createClient } from '@/utils/supabase/server'

export const createCollection = authenticatedProcedure
  .createServerAction()
  .input(createCollectionInputSchema)
  .handler(async ({ input }) => {
    const collectionsService = ServiceLocator.getService('CollectionsService')

    let collection: CollectionDTO

    try {
      collection = await collectionsService.createCollection({
        title: input.title,
        description: input.description,
      })
    } catch (err) {
      if (err instanceof CreateCollectionError) {
        // TODO: report err.cause to Sentry
        throw new ZSAError('ERROR', 'Cannot create collection. Reason: ' + err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    redirect(`/app/collections/${collection.fingerprint}`)
  })

export const updateCollection = authenticatedProcedure
  .createServerAction()
  .input(updateCollectionInputSchema)
  .handler(async ({ input }) => {
    const collectionsService = ServiceLocator.getService('CollectionsService')

    let collection: CollectionDTO
    try {
      collection = await collectionsService.updateCollection(
        input.fingerprint,
        input
      )
    } catch (err) {
      if (err instanceof UpdateCollectionError) {
        // TODO: report err.cause to Sentry
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
    const collectionsService = ServiceLocator.getService('CollectionsService')

    let collection: CollectionDTO

    try {
      collection = await collectionsService.deleteCollection(input.fingerprint)
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
    const collectionsService = ServiceLocator.getService('CollectionsService')

    let updatedCollection: CollectionDTO

    try {
      updatedCollection = await collectionsService.updateCollection(
        input.fingerprint,
        { published: input.checked }
      )
    } catch (err) {
      // TODO: report error to Sentry
      throw new ZSAError('ERROR', `Cannot ${input.checked ? 'publish' : 'unpublish'} collection`)
    }

    revalidatePath(`/app/collections/${updatedCollection.fingerprint}`)
    return updatedCollection
  })

export const addLinkToCollection = authenticatedProcedure
  .createServerAction()
  .input(addLinkToCollectionInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()
    const authenticationService = ServiceLocator.getService('AuthenticationService')

    const user = await authenticationService.getUser()

    const { data: existingLink, error } = await supabase
      .from('link')
      .select()
      .eq('fingerprint', input.linkFingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      throw new Error('Failed to fetch link', { cause: error })
    }

    if (!existingLink) {
      throw new Error('Link not found')
    }

    const { error: linkError } = await supabase.from('collection_link').insert({
      link_pk: input.linkFingerprint,
      collection_pk: input.fingerprint,
      visible: true,
    })

    if (linkError) {
      throw new Error('Failed to add link to collection', { cause: linkError })
    }

    revalidatePath(`/app/collections/${input.fingerprint}`)
  })

export const removeLinkFromCollection = authenticatedProcedure
  .createServerAction()
  .input(removeLinkFromCollectionInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()

    const { data: existingJunction, error } = await supabase
      .from('collection_link')
      .select()
      .eq('link_pk', input.linkFingerprint)
      .eq('collection_pk', input.fingerprint)
      .single()

    if (error) {
      return { error: 'Failed to fetch link <> collection relation' }
    }

    if (!existingJunction) {
      return { error: 'Link not found in collection' }
    }

    const { error: deleteError } = await supabase
      .from('collection_link')
      .delete()
      .eq('link_pk', input.linkFingerprint)
      .eq('collection_pk', input.fingerprint)
      .select()

    if (deleteError) {
      return { error: 'Failed to remove link from collection' }
    }

    revalidatePath(`/app/collections/${input.fingerprint}`)
    return { message: 'Link removed from collection successfully' }
  })

export const updateLinksOrder = authenticatedProcedure
  .createServerAction()
  .input(updateLinksOrderInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()
    const { fingerprint, linksOrder } = input

    const { error: updatedOrderError } = await supabase
      .from('collection_link')
      .upsert(
        linksOrder.map(({ fingerprint, order }) => ({
          link_pk: fingerprint,
          collection_pk: fingerprint,
          order,
        })),
        { onConflict: 'link_pk,collection_pk' }
      )
      .select('order,visible,link(*)')

    if (updatedOrderError) {
      throw new Error('Failed to update links order', {
        cause: updatedOrderError,
      })
    }

    revalidatePath(`/app/collections/${fingerprint}`)
  })
