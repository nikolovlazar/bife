import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'

import './globals.css'
import { ThemeProvider } from '@/web/_components/theme-provider'
import { Toaster } from '@/web/_components/ui/sonner'
import { cn } from '@/web/_lib/utils'

export const metadata: Metadata = {
  title: 'Bife - All you can link',
  description:
    'Bife is a link sharing app that lets you create and share link collections.',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{ classNames: { toast: 'rounded-none' } }}
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
