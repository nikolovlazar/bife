import { Utensils } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { TurnstileScript } from '@/app/_components/turnstile-script'

export const metadata: Metadata = {
  title: 'Bife | Authenticate',
  description: 'Create links collections.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2">
      <TurnstileScript />
      <div className="flex flex-col items-center justify-center p-12">
        <Link
          href="/"
          className="mb-12 flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Utensils className="h-10 w-auto" />
          <span className="text-3xl">Bife</span>
        </Link>
        {children}
      </div>
      <div className="hidden bg-muted bg-slate-900 lg:block"></div>
    </div>
  )
}
