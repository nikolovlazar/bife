import Link from 'next/link'

import { Button } from '@/web/_components/ui/button'

export default function InternalServerError() {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-primary-600 dark:text-primary-500 mb-4 font-mono text-7xl font-extrabold slashed-zero tabular-nums tracking-tight lg:text-9xl">
            500
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Something went wrong
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            The developers have been notified. Please try again.
          </p>
          <Button asChild>
            <Link
              href="/"
              className="bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
            >
              Back to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
