import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { createClient } from '@/utils/supabase/server'

export function SignOut() {
  async function signout() {
    'use server'
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    revalidatePath('/', 'layout')
    redirect('/')
  }

  return (
    <form action={signout}>
      <DropdownMenuItem asChild>
        <Button
          variant="link"
          type="submit"
          className="w-full justify-start focus-visible:ring-0 px-2 py-1.5 text-foreground hover:no-underline h-min font-semibold"
        >
          Sign out
        </Button>
      </DropdownMenuItem>
    </form>
  )
}
