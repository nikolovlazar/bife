import { Utensils } from 'lucide-react'
import NextLink from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'

import { getInjection } from '@/di/container'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/web/_components/ui/card'

export default async function PublicCollectionPage({
  params,
}: {
  params: { fingerprint: string }
}) {
  const getLinkOrCollectionUseCase = getInjection('GetLinkOrCollectionUseCases')

  let collection: Collection
  try {
    const { link, collection: c } = await getLinkOrCollectionUseCase.execute(
      params.fingerprint
    )

    if (link) {
      return permanentRedirect(link.url)
    }

    collection = c
  } catch (err) {
    if (err instanceof NotFoundError) {
      return notFound()
    }
    throw err
  }

  let displayedLinks: CollectionLinks = []
  try {
    const collectionLinkUseCases = getInjection('CollectionLinkUseCases')
    displayedLinks =
      await collectionLinkUseCases.getLinksForCollection(collection)
  } catch (err) {
    if (!(err instanceof NotFoundError)) {
      // TODO: send it to Sentry
      throw err
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{collection.title}</CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-1 flex-col justify-between gap-8">
        <div className="flex flex-1 flex-col gap-4">
          {displayedLinks.map(({ link }) => (
            <a
              key={link.fingerprint}
              href={link.url}
              target="_blank"
              rel="noopener nofollow"
              className="group flex flex-row items-center justify-between gap-2 overflow-hidden rounded-sm bg-background px-4 py-2 font-semibold shadow max-md:flex-col max-md:items-start md:gap-4"
            >
              <div className="flex gap-4">
                <span>🔗</span>
                <span className="shrink-0">{link.label}</span>
              </div>
              <span className="w-max max-w-full truncate text-xs font-normal text-muted-foreground group-hover:text-purple-500">
                {link.url}
              </span>
            </a>
          ))}
        </div>
        <NextLink
          href="/"
          className="flex w-max self-center rounded-md bg-background px-3 py-2 shadow"
        >
          <Utensils className="mr-1" />
          Create your own Bife collection
        </NextLink>
      </div>
    </>
  )
}
