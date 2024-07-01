'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

import {
  createLinkInputSchema,
  deleteLinkInputSchema,
  toggleLinkVisibilityInputSchema,
  updateLinkInputSchema,
} from '@/app/_lib/validation-schemas/links'
import { authenticatedProcedure } from '@/app/_lib/zsa-procedures'
import { createClient } from '@/utils/supabase/server'
import { ServiceLocator } from '@/services/serviceLocator'

export const createLink = authenticatedProcedure
  .createServerAction()
  .input(createLinkInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()
    const authenticationService = ServiceLocator.getService('AuthenticationService')
    const user = await authenticationService.getUser()

    const fingerprint = nanoid(8)

    // TODO: check collision

    const { data: createdLink, error: creationError } = await supabase
      .from('link')
      .insert({
        created_at: new Date().toUTCString(),
        created_by: user.id,
        url: input.url,
        label: input.label,
        fingerprint,
      })
      .select()
      .single()

    if (creationError) {
      return { error: 'Failed to create link' }
    }

    if (input.collection) {
      const { data: existingCollection, error } = await supabase
        .from('collection')
        .select()
        .eq('fingerprint', input.collection)
        .eq('created_by', user.id)
        .single()

      if (error) {
        return { error: 'Failed to fetch collection' }
      }

      if (!existingCollection) {
        return { error: 'Collection not found' }
      }

      const { error: collectionLinkError } = await supabase
        .from('collection_link')
        .insert({
          collection_pk: existingCollection.fingerprint,
          link_pk: createdLink.fingerprint,
          visible: true,
        })

      if (collectionLinkError) {
        return { error: 'Failed to add link to collection' }
      }

      revalidatePath(`/app/collections/${existingCollection?.fingerprint}`)
    }

    revalidatePath('/app/links')
    return { message: 'Link created successfully' }
  })

export const updateLink = authenticatedProcedure
  .createServerAction()
  .input(updateLinkInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()
    const authenticationService = ServiceLocator.getService('AuthenticationService')
    const user = await authenticationService.getUser()

    const { data: existingLink, error } = await supabase
      .from('link')
      .select()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      return { error: 'Failed to fetch link' }
    }

    if (!existingLink) {
      return { error: 'Link not found' }
    }

    const newData = {
      url: input.url ?? existingLink.url,
      label: input.label ?? existingLink.label,
    }

    const { error: updateError } = await supabase
      .from('link')
      .update(newData)
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .select()
      .single()

    if (updateError) {
      return { error: 'Failed to update link' }
    }

    revalidatePath('/app/links')
    return { message: 'Link updated successfully' }
  })

export const deleteLink = authenticatedProcedure
  .createServerAction()
  .input(deleteLinkInputSchema)
  .handler(async ({ input}) => {
    const supabase = createClient()
    const authenticationService = ServiceLocator.getService('AuthenticationService')
    const user = await authenticationService.getUser()

    const { data: existingLink, error } = await supabase
      .from('link')
      .select()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)
      .single()

    if (error) {
      return { error: 'Failed to fetch link' }
    }

    if (!existingLink) {
      return { error: 'Link not found' }
    }

    const { error: deleteError } = await supabase
      .from('link')
      .delete()
      .eq('fingerprint', input.fingerprint)
      .eq('created_by', user.id)

    if (deleteError) {
      return { error: 'Failed to delete link' }
    }

    revalidatePath('/app/links')
    return { message: 'Link deleted successfully' }
  })

export const toggleLinkVisibility = authenticatedProcedure
  .createServerAction()
  .input(toggleLinkVisibilityInputSchema)
  .handler(async ({ input }) => {
    const supabase = createClient()

    const { data: existingRelation, error } = await supabase
      .from('collection_link')
      .select()
      .eq('collection_pk', input.collection_pk)
      .eq('link_pk', input.link_pk)
      .single()

    if (error) {
      throw new Error('Failed to fetch linking', { cause: error })
    }

    if (!existingRelation) {
      throw new Error(
        'Cannot update link visibility because it is not linked with the provided collection'
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('collection_link')
      .update({ visible: input.checked })
      .eq('collection_pk', input.collection_pk)
      .eq('link_pk', input.link_pk)
      .select()

    if (updateError) {
      throw new Error('Failed to update link visibility', {
        cause: updateError,
      })
    }

    revalidatePath(`/app/collections/${input.collection_pk}`)
    return updated
})
