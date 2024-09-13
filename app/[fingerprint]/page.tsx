import NextLink from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'
import { Link } from '@/entities/models/link'

export default async function PublicCollectionPage({
  params,
}: {
  params: { fingerprint: string }
}) {
  let link: Link
  try {
    link = await getLinkUseCase(params.fingerprint)
    return permanentRedirect(link.url)
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
  }

  let collection: Collection
  try {
    collection = await getCollectionUseCase(params.fingerprint)
  } catch (err) {
    if (err instanceof NotFoundError) {
      return notFound()
    }
    throw err
  }

  let displayedLinks: CollectionLinks = []
  try {
    displayedLinks = await getLinksForCollectionUseCase(collection)
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      throw err
    }
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
          {displayedLinks.map(({ link }) => (
            <a
              key={link.fingerprint}
              href={link.url}
              target="_blank"
              rel="noopener nofollow"
              className="group flex flex-row items-center justify-between gap-2 overflow-hidden py-2 font-semibold max-md:flex-col max-md:items-start"
            >
              <span className="flex shrink-0 gap-4">{link.label}</span>
              <span className="h-5 flex-1 border-b-2 border-dotted border-b-muted-foreground max-md:hidden" />
              <span className="w-max max-w-full truncate text-xs font-normal text-muted-foreground group-hover:text-primary">
                {new URL(link.url).origin
                  .replace('https://', '')
                  .replace('http://', '')}
              </span>
            </a>
          ))}
        </div>
        <hr />
        <NextLink href="https://bife.sh" className="text-center">
          Create your own Bife collection
        </NextLink>
      </div>
    </>
  )
}
