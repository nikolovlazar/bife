import { redirect } from 'next/navigation'
import { createServerActionProcedure } from 'zsa'

import { createClient } from '@/utils/supabase/server'

export const authenticatedProcedure = createServerActionProcedure().handler(
  async () => {
    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect('/signin')
    }

    return { user, supabase }
  }
)
