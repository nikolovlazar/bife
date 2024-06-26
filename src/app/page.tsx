import { Infinity, ChevronRight, LineChartIcon, QrCode } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'

import { thirtyRandomSlugs } from '@/lib/fake-data'

import { BentoGrid, BentoGridItem } from '@/app/_components/custom/bento'
import { FallingLogos } from '@/app/_components/custom/falling-logos'
import { Scroller } from '@/app/_components/custom/scroller'

import { NavCTA } from './cta-nav'

const AnalyticsChart = dynamic(
  () => import('../components/custom/analytics-chart'),
  {
    ssr: false,
  }
)

export default function Home() {
  return (
    <div className="dark flex min-h-screen flex-col overflow-hidden bg-background font-sans antialiased">
      <div className="relative flex justify-center pb-20 md:h-[90dvh]">
        <FallingLogos />
        <nav className="fixed inset-x-0 top-10 z-20 mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-white/20 bg-black/85 py-2 pl-8 pr-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <Link
            href="/"
            className="relative flex items-center space-x-1 bg-opacity-50 bg-gradient-to-b from-neutral-100 to-neutral-300 bg-clip-text font-bold text-transparent"
          >
            <h1 className="text-sm">Bife 🍴</h1>
          </Link>
          <Link
            href="#features"
            className="relative flex items-center space-x-1 text-neutral-50 hover:text-neutral-300"
          >
            <span className="text-sm">Features</span>
          </Link>
          <Suspense fallback={<span />}>
            <NavCTA />
          </Suspense>
        </nav>
        <div className="relative z-10 mx-auto flex h-max w-max max-w-7xl flex-col items-center p-4 px-4 pt-32 md:pt-32 xl:pt-48">
          <h2 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text py-1 text-center text-4xl font-semibold text-transparent md:text-5xl">
            All you can link
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-balance text-center text-lg font-normal text-neutral-300 text-shadow">
            Bife (&quot;buffet&quot;) allows you to create infinite link
            collections and share them with a short URL or a QR code.
          </p>
          <Link
            href="/signin"
            className="relative mt-8 rounded-full border border-white/[0.2] bg-primary px-4 py-2 text-xl font-medium text-white hover:bg-primary/80"
          >
            <span className="flex items-center gap-x-2">
              Get started <ChevronRight />
            </span>
            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-white to-transparent" />
          </Link>
        </div>
      </div>
      <div className="border-t border-t-neutral-700/50 py-24 bg-dot-neutral-700/50">
        <div id="features" className="mx-auto flex max-w-3xl flex-col px-4">
          <h2 className="text-balance bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-500 bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-4xl">
            Must-have features for{' '}
            <span className="inline-flex h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] flex-col overflow-hidden text-violet-500 md:h-[calc(theme(fontSize.4xl)*theme(lineHeight.tight))]">
              <ul className="block animate-text-slide text-left [&_li]:block">
                <li>content creators</li>
                <li>marketers</li>
                <li>speakers</li>
                <li aria-hidden="true">content creators</li>
              </ul>
            </span>
          </h2>
          <BentoGrid className="mx-auto mt-8 max-w-4xl auto-rows-[18rem] md:grid-cols-2">
            <BentoGridItem
              title="Infinite collections"
              description="You're not stuck with just a single collection. Bife lets you create infinite collections for all of your links and events."
              header={
                <Scroller speed="slow" pauseOnHover={false}>
                  <div className="flex w-[1794px] flex-wrap gap-2">
                    {thirtyRandomSlugs.map((slug) => (
                      <div
                        key={slug}
                        className="w-max rounded-sm border border-slate-800 px-2 py-1 text-violet-300/50"
                      >
                        {slug}
                      </div>
                    ))}
                  </div>
                </Scroller>
              }
              icon={<Infinity className="text-neutral-400" />}
            />
            <BentoGridItem
              title="QR Codes"
              description="You can also create QR codes for each of your collections so you can share them more conveniently."
              header={<span />}
              icon={<QrCode className="text-neutral-400" />}
            />
            <BentoGridItem
              title="Analytics"
              description="Bife lets you know how many visitors landed on each of your collections, where they are from, what device they used, etc..."
              header={<AnalyticsChart />}
              className="md:col-span-2"
              icon={<LineChartIcon className="text-neutral-400" />}
            />
          </BentoGrid>
        </div>
      </div>
    </div>
  )
}
