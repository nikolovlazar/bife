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
