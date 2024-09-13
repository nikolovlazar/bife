import Link from 'next/link'

import { getUserController } from '@/interface-adapters/controllers/get-user.controller'

export default async function Home() {
  let user: { id: string; email?: string } | undefined
  try {
    user = await getUserController()
  } catch (err) {}

  return (
    <main className="min-h-screen overflow-hidden bg-background p-4 font-sans antialiased">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-12 py-6 lg:py-24">
        <section className="flex flex-col gap-4">
          <h1 className="flex scroll-m-20 items-start gap-2 text-4xl font-semibold tracking-tight lg:text-5xl">
            Bife{' '}
            <sup className="mt-2 font-serif text-lg font-normal italic tracking-tighter">
              All you can link
            </sup>
          </h1>
          <ul className="flex gap-4">
            {user ? (
              <li>
                <Link href="/app">Dashboard</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/signup">Join</Link>
                </li>
                <li>
                  <Link href="/signin">Sign in</Link>
                </li>
              </>
            )}
            <li>
              <Link href="https://github.com/nikolovlazar/bife">GitHub</Link>
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl">
            <dfn>
              <abbr title='Macedonian for "Buffet"' className="font-serif">
                Bife
              </abbr>
            </dfn>{' '}
            is a simple, open source URL shortening application that you can
            either self-host, or use the managed service.
          </h2>
        </section>
        <section>
          <dl>
            <dt className="text-lg font-semibold">Shorten URLs</dt>
            <dd className="mb-4 ml-4 font-serif italic">
              Turn long URLs into short 15-letter URLs that are easy to share.
            </dd>
            <dt className="text-lg font-semibold">Create Collections</dt>
            <dd className="mb-4 ml-4 font-serif italic">
              Group your links into collections for easy access. Perfect for
              organizing related content.
            </dd>
            <dt className="text-lg font-semibold">Share Collections</dt>
            <dd className="mb-4 ml-4 font-serif italic">
              Just like the links, collections also have a short URL that you
              can share.
            </dd>
            <dt className="text-lg font-semibold">Track Analytics</dt>
            <dd className="mb-4 ml-4 font-serif italic">
              Monitor the performance of your links and collections with visit
              analytics.
            </dd>
          </dl>
        </section>
        <hr />
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
        </footer>
      </div>
    </main>
  )
}
