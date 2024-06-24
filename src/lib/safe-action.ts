import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createServerActionProcedure } from 'zsa'

export const authenticatedAction = createServerActionProcedure().handler(
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
