import { type NextRequest, NextResponse } from 'next/server'

import { updateSession } from '@/utils/supabase/middleware'

const protectedRoutes: string[] = ['/reset-password', '/app']
export async function middleware(request: NextRequest) {
  let { user, response } = await updateSession(request)

  if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
    response = NextResponse.redirect(new URL('/signin', request.url))
  } else {
    response = NextResponse.next()
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|signin|signup|forgot-password|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
