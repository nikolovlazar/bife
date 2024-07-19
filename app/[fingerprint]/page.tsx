import { Utensils } from 'lucide-react'
import NextLink from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { CollectionLinks } from '@/entities/models/collection-link'
import { Link } from '@/entities/models/link'

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
