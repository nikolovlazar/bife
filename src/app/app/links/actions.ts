'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { GenericFormState } from '@/utils/types'

export async function createLink(_: GenericFormState, formData: FormData) {
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
    return { error: 'URL is required' }
  }

  if (!formValues.label) {
    return { error: 'Label is required' }
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
    return { error: 'Failed to create link' }
  }

  if (formValues.collection) {
    const { data: existingCollection, error } = await supabase
      .from('collection')
      .select()
      .eq('fingerprint', formValues.collection)
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
}

export async function updateLink(_: GenericFormState, formData: FormData) {
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
    return { error: 'Link is required' }
  }

  if (!formValues.url) {
    return { error: 'URL is required' }
  }

  if (!formValues.label) {
    return { error: 'Label is required' }
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    return { error: 'Failed to fetch link' }
  }

  if (!existingLink) {
    return { error: 'Link not found' }
  }

  const newData = {
    url: formValues.url ?? existingLink.url,
    label: formValues.label ?? existingLink.label,
  }

  const { error: updateError } = await supabase
    .from('link')
    .update(newData)
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    return { error: 'Failed to update link' }
  }

  revalidatePath('/app/links')
  return { message: 'Link updated successfully' }
}

export async function deleteLink(_: GenericFormState, formData: FormData) {
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
    return { error: 'Link is required' }
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('fingerprint', formValues.fingerprint)
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
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)

  if (deleteError) {
    return { error: 'Failed to delete link' }
  }

  revalidatePath('/app/links')
  return { message: 'Link deleted successfully' }
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
