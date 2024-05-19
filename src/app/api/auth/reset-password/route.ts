import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  const origin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://bife.sh'

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    return NextResponse.redirect(`${origin}/reset-password`)
  }

  // eslint-disable-next-line no-console
  console.error('ERROR: Invalid auth code or no auth code found')

  return NextResponse.redirect(`${origin}/signin`)
}
