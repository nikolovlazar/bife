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
    throw new Error('Fingerprint is required')
  }

  const { data: existingCollection, error } = await supabase
    .from('link_collection')
    .select()
    .eq('fingerprint', formValues.fingerprint)
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

  if (deleteError) {
    throw new Error('Failed to delete collection', { cause: deleteError })
  }

  revalidatePath('/app/collections')
  redirect('/app/collections')
}
