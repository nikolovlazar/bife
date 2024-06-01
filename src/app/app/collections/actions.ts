'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { GenericFormState } from '@/utils/types'

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

  const fingerprint = nanoid(8)

  // TODO: check collision

  const { data, error: creationError } = await supabase
    .from('collection')
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
    .from('collection')
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
    .from('collection')
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
    .from('collection')
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
    .from('collection')
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
    .from('collection')
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
    .from('collection')
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

export async function addLinkToCollection(
  linkFingerprint: string,
  collectionFingerprint: string
) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const { data: existingLink, error } = await supabase
    .from('link')
    .select()
    .eq('fingerprint', linkFingerprint)
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
    .eq('fingerprint', collectionFingerprint)
    .eq('created_by', user.id)
    .single()

  if (collectionError) {
    throw new Error('Failed to fetch collection', { cause: collectionError })
  }

  if (!existingCollection) {
    throw new Error('Collection not found')
  }

  const { error: linkError } = await supabase.from('collection_link').insert({
    link_pk: linkFingerprint,
    collection_pk: collectionFingerprint,
    visible: true,
  })

  if (linkError) {
    throw new Error('Failed to add link to collection', { cause: linkError })
  }

  revalidatePath(`/app/collections/${existingCollection.fingerprint}`)
}

export async function removeLinkFromCollection(
  _: GenericFormState,
  formData: FormData
) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const formValues = {
    linkFingerprint: formData.get('link_fingerprint')?.toString(),
    collectionFingerprint: formData.get('collection_fingerprint')?.toString(),
  }

  if (!formValues.linkFingerprint || !formValues.collectionFingerprint) {
    return { error: 'Both Link and Colleciton are required' }
  }

  const { data: existingJunction, error } = await supabase
    .from('collection_link')
    .select()
    .eq('link_pk', formValues.linkFingerprint)
    .eq('collection_pk', formValues.collectionFingerprint)
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
    .eq('link_pk', formValues.linkFingerprint)
    .eq('collection_pk', formValues.collectionFingerprint)
    .select()

  if (deleteError) {
    return { error: 'Failed to remove link from collection' }
  }

  revalidatePath(`/app/collections/${formValues.collectionFingerprint}`)
  return { message: 'Link removed from collection successfully' }
}

export async function updateLinksOrder(
  collectionFingerprint: string,
  linksOrder: { fingerprint: string; order: number }[]
) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  if (!collectionFingerprint || !linksOrder) {
    throw new Error('Both Link and Colleciton are required')
  }

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
}
