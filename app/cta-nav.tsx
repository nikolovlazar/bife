import Link from 'next/link'

import { createClient } from '@/infrastructure/utils/supabase/server'

export async function NavCTA() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return !!user ? (
    <Link
      href="/app"
      className="relative rounded-full border border-white/[0.2] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
    >
      <span>Go to Dashboard</span>
      <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
    </Link>
  ) : (
    <Link
      href="/signin"
      className="relative rounded-full border border-white/[0.2] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
    >
      <span>Sign in</span>
      <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
    </Link>
  )
}
