'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { authenticatedAction } from '@/lib/safe-action'
import {
  addLinkToCollectionInputSchema,
  createCollectionInputSchema,
  deleteCollectionInputSchema,
  removeLinkFromCollectionInputSchema,
  toggleCollectionPublishedInputSchema,
  updateCollectionInputSchema,
  updateLinksOrderInputSchema,
} from '@/lib/validation-schemas/collections'

export const createCollection = authenticatedAction
  .createServerAction()
  .input(createCollectionInputSchema)
  .handler(async ({ input, ctx }) => {
    const { user, supabase } = ctx

    const fingerprint = nanoid(8)

    // TODO: check collision

    const { data, error: creationError } = await supabase
      .from('collection')
      .insert({
        created_at: new Date().toUTCString(),
        created_by: user.id,
        title: input.title,
        description: input.description,
        fingerprint,
      })
      .select()

    if (creationError) {
      throw new Error('Failed to create collection', { cause: creationError })
    }

    const newCollection = data[0]

    revalidatePath('/app/collections')
    redirect(`/app/collections/${newCollection.fingerprint}`)
  })

export const updateCollection = authenticatedAction
  .createServerAction()
  .input(updateCollectionInputSchema)
  .handler(async ({ input, ctx }) => {
    const { user, supabase } = ctx

    const { data: existingCollection, error } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      throw new Error('Failed to fetch collection', { cause: error })
    }

    if (!existingCollection) {
      throw new Error('Collection not found')
    }

    const newData = {
      title: input.title ?? existingCollection.title,
      description: input.description ?? existingCollection.description,
      published: input.published ?? existingCollection.published,
    }

    const { data: updatedCollection, error: updateError } = await supabase
      .from('collection')
      .update(newData)
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .select()
      .single()

    if (updateError) {
      throw new Error('Failed to update collection', { cause: updateError })
    }

    revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
    return updatedCollection
  })

export const deleteCollection = authenticatedAction
  .createServerAction()
  .input(deleteCollectionInputSchema)
  .handler(async ({ input, ctx }) => {
    const { user, supabase } = ctx

    const { data: existingCollection, error } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      throw new Error('Failed to fetch collection', { cause: error })
    }

    if (!existingCollection) {
      throw new Error('Collection not found')
    }

    const { error: deleteError } = await supabase
      .from('collection')
      .delete()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)

    if (deleteError) {
      throw new Error('Failed to delete collection', { cause: deleteError })
    }

    revalidatePath('/app/collections')
    redirect('/app/collections')
  })

export const toggleCollectionPublished = authenticatedAction
  .createServerAction()
  .input(toggleCollectionPublishedInputSchema)
  .handler(async ({ input, ctx }) => {
    const { user, supabase } = ctx

    const { data: existingCollection, error } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      throw new Error('Failed to fetch collection', { cause: error })
    }

    if (!existingCollection) {
      throw new Error('Collection not found')
    }

    const { data: updatedCollection, error: updateError } = await supabase
      .from('collection')
      .update({ published: input.checked })
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .select()
      .single()

    if (updateError) {
      throw new Error('Failed to update collection', { cause: updateError })
    }

    revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
    return updatedCollection
  })

export const addLinkToCollection = authenticatedAction
  .createServerAction()
  .input(addLinkToCollectionInputSchema)
  .handler(async ({ input, ctx }) => {
    const { user, supabase } = ctx

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

    const { data: existingCollection, error: collectionError } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', input.collectionFingerprint)
      .eq('created_by', user.id)
      .single()

    if (collectionError) {
      throw new Error('Failed to fetch collection', { cause: collectionError })
    }

    if (!existingCollection) {
      throw new Error('Collection not found')
    }

    const { error: linkError } = await supabase.from('collection_link').insert({
      link_pk: input.linkFingerprint,
      collection_pk: input.collectionFingerprint,
      visible: true,
    })

    if (linkError) {
      throw new Error('Failed to add link to collection', { cause: linkError })
    }

    revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
  })

export const removeLinkFromCollection = authenticatedAction
  .createServerAction()
  .input(removeLinkFromCollectionInputSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const { data: existingJunction, error } = await supabase
      .from('collection_link')
      .select()
      .eq('link_pk', input.linkFingerprint)
      .eq('collection_pk', input.collectionFingerprint)
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
      .eq('collection_pk', input.collectionFingerprint)
      .select()

    if (deleteError) {
      return { error: 'Failed to remove link from collection' }
    }

    revalidatePath(`/app/collections/${input.collectionFingerprint}`)
    return { message: 'Link removed from collection successfully' }
  })

export const updateLinksOrder = authenticatedAction
  .createServerAction()
  .input(updateLinksOrderInputSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const { collectionFingerprint, linksOrder } = input

    const { error: updatedOrderError } = await supabase
      .from('collection_link')
      .upsert(
        linksOrder.map(({ fingerprint, order }) => ({
          link_pk: fingerprint,
          collection_pk: collectionFingerprint,
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

    revalidatePath(`/app/collections/${collectionFingerprint}`)
  })
