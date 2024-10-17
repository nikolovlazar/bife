'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export function SetSentryUser({ email }: { email: string | undefined }) {
  useEffect(() => {
    if (email && email !== '') {
      Sentry.setUser({ email })
    }
  }, [email])

  return <></>
}
