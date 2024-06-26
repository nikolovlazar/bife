import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServerActionProcedure } from 'zsa'

import { createClient } from '@/utils/supabase/server'

import { CollectionsRepository } from '@/repositories/collectionsRepository'
import { AuthenticationService } from '@/services/authorizationService'
import { CollectionsService } from '@/services/collectionsService'

export const baseProcedure = createServerActionProcedure().handler(() => {
  const collectionsRepository = new CollectionsRepository()
  const collectionsService = new CollectionsService(collectionsRepository)

  const authenticationService = new AuthenticationService()

  return { collectionsService, authenticationService }
})

export const authenticatedProcedure = createServerActionProcedure(
  baseProcedure
).handler(async ({ ctx }) => {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  return { user, supabase, ...ctx }
})

export const ownsCollectionProcedure = createServerActionProcedure(
  authenticatedProcedure
)
  .input(z.object({ fingerprint: z.string() }))
  .handler(async ({ ctx, input }) => {
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

    return { user, supabase, existingCollection }
  })
