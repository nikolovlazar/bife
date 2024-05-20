'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function createCollection(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    title: formData.get('title')?.toString(),
    description: formData.get('description')?.toString(),
  }

  if (!formValues.title) {
    throw new Error('Title is required')
  }

  const fingerprint = nanoid(10)

  // TODO: check collision

  const { data, error: creationError } = await supabase
    .from('link_collection')
    .insert({
      created_at: new Date().toUTCString(),
      created_by: user.id,
      title: formValues.title,
      description: formValues.description,
      fingerprint,
    })
    .select()

  if (creationError) {
    throw new Error('Failed to create collection', { cause: creationError })
  }

  const newCollection = data[0]

  revalidatePath('/app/collections')
  redirect(`/app/collections/${newCollection.fingerprint}`)
}

export async function updateCollection(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    title: formData.get('title')?.toString(),
    published: formData.get('published')?.toString() === 'on',
    description: formData.get('description')?.toString(),
    fingerprint: formData.get('fingerprint')?.toString(),
  }

  if (!formValues.fingerprint) {
    throw new Error('Fingerprint is required')
  }

  if (!formValues.title) {
    throw new Error('Title is required')
  }

  const { data: existingCollection, error } = await supabase
    .from('link_collection')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch collection', { cause: error })
  }

  if (!existingCollection) {
    throw new Error('Collection not found')
  }

  const newData = {
    title: formValues.title ?? existingCollection.title,
    description: formValues.description ?? existingCollection.description,
    published: formValues.published ?? existingCollection.published,
  }

  const { data: updatedCollection, error: updateError } = await supabase
    .from('link_collection')
    .update(newData)
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    throw new Error('Failed to update collection', { cause: updateError })
  }

  revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
  return updatedCollection
}

export async function deleteCollection(formData: FormData) {
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
    throw new Error('Collection is required')
  }

  const { data: existingCollection, error } = await supabase
    .from('link_collection')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch collection', { cause: error })
  }

  if (!existingCollection) {
    throw new Error('Collection not found')
  }

  const { error: deleteError } = await supabase
    .from('link_collection')
    .delete()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)

  if (deleteError) {
    throw new Error('Failed to delete collection', { cause: deleteError })
  }

  revalidatePath('/app/collections')
  redirect('/app/collections')
}

export async function toggleCollectionPublished(formData: FormData) {
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
    checked: formData.get('checked')?.toString() === 'true',
  }

  if (!formValues.fingerprint) {
    throw new Error('Collection is required')
  }

  const { data: existingCollection, error } = await supabase
    .from('link_collection')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch collection', { cause: error })
  }

  if (!existingCollection) {
    throw new Error('Collection not found')
  }

  const { data: updatedCollection, error: updateError } = await supabase
    .from('link_collection')
    .update({ published: formValues.checked })
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    throw new Error('Failed to update collection', { cause: updateError })
  }

  revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
  return updatedCollection
}

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
    fingerprint: formData.get('fingerprint')?.toString(),
    url: formData.get('url')?.toString(),
    description: formData.get('description')?.toString(),
  }

  if (!formValues.fingerprint) {
    throw new Error('Collection is required')
  }

  if (!formValues.url) {
    throw new Error('URL is required')
  }

  const { data: existingCollection, error } = await supabase
    .from('link_collection')
    .select()
    .eq('fingerprint', formValues.fingerprint)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch collection', { cause: error })
  }

  if (!existingCollection) {
    throw new Error('Collection not found')
  }

  const { data, error: creationError } = await supabase
    .from('link')
    .insert({
      created_at: new Date().toUTCString(),
      created_by: user.id,
      collection: existingCollection.fingerprint,
      url: formValues.url,
      description: formValues.description,
    })
    .select()
    .single()

  if (creationError) {
    throw new Error('Failed to create link', { cause: creationError })
  }

  revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
  return data
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
    id: formData.get('id')?.toString(),
    visible: formData.get('visible')?.toString() === 'on',
    url: formData.get('url')?.toString(),
    description: formData.get('description')?.toString(),
  }

  if (!formValues.id) {
    throw new Error('Link is required')
  }

  if (!formValues.url) {
    throw new Error('URL is required')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('id', formValues.id)
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
    description: formValues.description ?? existingLink.description,
    visible: formValues.visible ?? existingLink.visible,
  }

  const { data: updatedLink, error: updateError } = await supabase
    .from('link')
    .update(newData)
    .eq('id', formValues.id)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    throw new Error('Failed to update link', { cause: updateError })
  }

  revalidatePath(`/app/collections/${existingLink.collection}`)
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
    id: formData.get('id')?.toString(),
  }

  if (!formValues.id) {
    throw new Error('Link is required')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('id', formValues.id)
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
    .eq('id', formValues.id)
    .eq('created_by', user.id)

  if (deleteError) {
    throw new Error('Failed to delete link', { cause: deleteError })
  }

  revalidatePath(`/app/collections/${existingLink.collection}`)
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
    id: formData.get('id')?.toString(),
    checked: formData.get('checked')?.toString() === 'true',
  }

  if (!formValues.id) {
    throw new Error('Link is required')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('id', formValues.id)
    .eq('created_by', user.id)
    .single()

  if (error) {
    throw new Error('Failed to fetch link', { cause: error })
  }

  if (!existingLink) {
    throw new Error('Link not found')
  }

  const { data: updatedLink, error: updateError } = await supabase
    .from('link')
    .update({ visible: formValues.checked })
    .eq('id', formValues.id)
    .eq('created_by', user.id)
    .select()
    .single()

  if (updateError) {
    throw new Error('Failed to update link', { cause: updateError })
  }

  revalidatePath(`/app/collections/${existingLink.collection}`)
  return updatedLink
}
