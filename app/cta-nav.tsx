import Link from 'next/link'

import { getUserController } from '@/interface-adapters/controllers/get-user.controller'

export async function NavCTA() {
  const user = await getUserController()

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
