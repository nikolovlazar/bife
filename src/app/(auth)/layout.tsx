import { Utensils } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { TurnstileScript } from '@/components/turnstile-script'

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
    <div className="w-full lg:grid lg:grid-cols-2 h-screen">
      <TurnstileScript />
      <div className="flex flex-col items-center justify-center p-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base mb-12"
        >
          <Utensils className="w-auto h-10" />
          <span className="text-3xl">Bife</span>
        </Link>
        {children}
      </div>
      <div className="hidden bg-muted lg:block bg-slate-900"></div>
    </div>
  )
}
