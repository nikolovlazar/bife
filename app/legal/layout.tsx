import Link from 'next/link'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-background p-4 font-sans antialiased">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-8 flex scroll-m-20 items-start gap-2 text-4xl font-semibold tracking-tight lg:text-5xl"
        >
          Bife{' '}
          <sup className="mt-2 font-serif text-lg font-normal italic tracking-tighter">
            All you can link
          </sup>
        </Link>
        {children}
        <hr className="my-8" />
        <footer>
          <p className="text-center text-sm text-muted-foreground">
            Built by{' '}
            <Link
              href="https://youtube.com/@nikolovlazar"
              className="text-secondary-foreground"
            >
              Lazar Nikolov
            </Link>
            .
          </p>
          <nav className="mt-4 flex justify-center space-x-4">
            <Link
              href="/legal/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  )
}
