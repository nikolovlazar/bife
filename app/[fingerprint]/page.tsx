import * as Sentry from '@sentry/nextjs'
import NextLink from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'

import { getByFingerprintController } from '@/interface-adapters/controllers/get-by-fingerprint.controller'

export default async function PublicCollectionPage({
  params,
}: {
  params: { fingerprint: string }
}) {
  Sentry.getCurrentScope().setTransactionName('/[fingerprint]')

  if (!params.fingerprint) {
    return notFound()
  }

  let displayLinks: CollectionLinks = []
  let collection: Collection

  try {
    const resource = await getByFingerprintController({
      fingerprint: params.fingerprint,
    })

    if (!resource) {
      return notFound()
    }

    if (resource.link) {
      return permanentRedirect(resource.link.url)
    }

    displayLinks = resource.displayLinks
    collection = resource.collection
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }

    return notFound()
  }

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {collection.title}
      </h1>
      <p className="leading-7">{collection.description}</p>
      <hr />
      <div className="flex flex-1 flex-col justify-between gap-8">
        <div className="flex flex-1 flex-col">
          {displayLinks.map(({ link }) => (
            <a
              key={link.fingerprint}
              href={link.url}
              target="_blank"
              rel="noopener nofollow"
              className="group flex flex-row items-center justify-between gap-2 overflow-hidden py-2 font-semibold max-md:flex-col max-md:items-start"
            >
              <span className="flex shrink-0 gap-4">{link.label}</span>
              <span className="h-5 flex-1 border-b-2 border-dotted group-hover:border-b-secondary-foreground max-md:hidden" />
              <span className="w-max max-w-full truncate text-xs font-normal text-muted-foreground group-hover:text-primary">
                {new URL(link.url).origin
                  .replace('https://', '')
                  .replace('http://', '')}
              </span>
            </a>
          ))}
        </div>
        <hr />
        <NextLink
          href="https://bife.sh"
          className="text-center text-muted-foreground"
        >
          Create your own{' '}
          <span className="font-semibold text-secondary-foreground">Bife</span>{' '}
          collection
        </NextLink>
      </div>
    </>
  )
}
