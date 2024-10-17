'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function UserFeedbackWidget() {
  useEffect(() => {
    Sentry.getFeedback()?.createWidget()
  }, [])
  return <></>
}
