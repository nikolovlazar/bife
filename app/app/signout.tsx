import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

import { Button } from '@/web/_components/ui/button'
import { DropdownMenuItem } from '@/web/_components/ui/dropdown-menu'

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
          className="h-min w-full justify-start px-2 py-1.5 font-semibold text-foreground hover:no-underline focus-visible:ring-0"
        >
          Sign out
        </Button>
      </DropdownMenuItem>
    </form>
  )
}
