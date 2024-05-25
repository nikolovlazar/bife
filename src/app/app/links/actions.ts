'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import type { Collection, Link } from '@/utils/types'

export async function createLink(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    collection: formData.get('collection')?.toString(),
    url: formData.get('url')?.toString(),
    label: formData.get('label')?.toString(),
  }

  if (!formValues.url) {
    throw new Error('URL is required')
  }

  if (!formValues.label) {
    throw new Error('Label is required')
  }

  const fingerprint = nanoid(8)

  // TODO: check collision

  const { data: createdLink, error: creationError } = await supabase
    .from('link')
    .insert({
      created_at: new Date().toUTCString(),
      created_by: user.id,
      url: formValues.url,
      label: formValues.label,
      fingerprint,
    })
    .select()
    .single()

  if (creationError) {
    throw new Error('Failed to create link', { cause: creationError })
  }

  if (formValues.collection) {
    const { data: existingCollection, error } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', formValues.collection)
      .eq('created_by', user.id)
      .single()

    if (error) {
      throw new Error('Failed to fetch collection', { cause: error })
    }

    if (!existingCollection) {
      throw new Error('Collection not found')
    }

    const { error: collectionLinkError } = await supabase
      .from('collection_link')
      .insert({
        collection_pk: existingCollection.fingerprint,
        link_pk: createdLink.fingerprint,
        visible: true,
      })

    if (collectionLinkError) {
      throw new Error('Failed to add link to collection', { cause: error })
    }

    revalidatePath(`/app/collections/${existingCollection?.fingerprint}`)
  }

  revalidatePath(`/app/links`)
  return createdLink
}

export async function updateLink(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    fingerprint: formData.get('fingerprint')?.toString(),
    url: formData.get('url')?.toString(),
    label: formData.get('label')?.toString(),
  }

  if (!formValues.fingerprint) {
    throw new Error('Link is required')
  }

  if (!formValues.url) {
    throw new Error('URL is required')
  }

  if (!formValues.label) {
    throw new Error('Label is required')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch link', { cause: error })
  }

  if (!existingLink) {
    throw new Error('Link not found')
  }

  const newData = {
    url: formValues.url ?? existingLink.url,
    label: formValues.label ?? existingLink.label,
  }

  const { data: updatedLink, error: updateError } = await supabase
    .from('link')
    .update(newData)
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    throw new Error('Failed to update link', { cause: updateError })
  }

  revalidatePath('/app/links')
  return updatedLink
}

export async function deleteLink(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    fingerprint: formData.get('fingerprint')?.toString(),
  }

  if (!formValues.fingerprint) {
    throw new Error('Link is required')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch link', { cause: error })
  }

  if (!existingLink) {
    throw new Error('Link not found')
  }

  const { error: deleteError } = await supabase
    .from('link')
    .delete()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)

  if (deleteError) {
    throw new Error('Failed to delete link', { cause: deleteError })
  }

  revalidatePath('/app/links')
}

export async function toggleLinkVisibility(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    link_pk: formData.get('link_pk')?.toString(),
    collection_pk: formData.get('collection_pk')?.toString(),
    checked: formData.get('checked')?.toString() === 'true',
  }

  if (!formValues.link_pk) {
    throw new Error('Link is required')
  }

  if (!formValues.collection_pk) {
    throw new Error('Collection is required')
  }

  const { data: existingRelation, error } = await supabase
    .from('collection_link')
    .select()
    .eq('collection_pk', formValues.collection_pk)
    .eq('link_pk', formValues.link_pk)
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
    .update({ visible: formValues.checked })
    .eq('collection_pk', formValues.collection_pk)
    .eq('link_pk', formValues.link_pk)
    .select()

  if (updateError) {
    throw new Error('Failed to update link visibility', { cause: updateError })
  }

  revalidatePath(`/app/collections/${formValues.collection_pk}`)
  return updated
}
