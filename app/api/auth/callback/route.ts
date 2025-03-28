import { NextResponse } from 'next/server'

// eslint-disable-next-line boundaries/element-types
import { createClient } from '@/infrastructure/utils/supabase/server'

export async function GET(request: Request) {
  // The `/api/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/app`)
}
