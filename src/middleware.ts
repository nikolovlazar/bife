import { type NextRequest, NextResponse } from 'next/server'

import { updateSession } from '@/infrastructure/utils/supabase/middleware'

import { IAuthenticationService } from './application/services/authentication-service.interface'
import { inject } from './di/container'
import { DI_TYPES } from './di/types'

const protectedRoutes: string[] = ['/reset-password', '/app']
export async function middleware(request: NextRequest) {
  const authenticationService = inject<IAuthenticationService>(
    DI_TYPES.AuthenticationService
  )

  console.log('Got the service!', authenticationService)
  let { user, response } = await updateSession(request)

  if (
    !user &&
    protectedRoutes.some((pr) => request.nextUrl.pathname.startsWith(pr))
  ) {
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
