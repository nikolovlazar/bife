import { Utensils } from 'lucide-react'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { createClient } from '@/utils/supabase/server'

export default async function PublicCollectionPage({
  params,
}: {
  params: { fingerprint: string }
}) {
  const supabase = createClient()
  const { data: collections, error: collectionError } = await supabase
    .from('collection')
    .select('*')
    .eq('fingerprint', params.fingerprint)
  const collection = collections?.[0]

  if (collectionError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error loading collection</CardTitle>
          <CardDescription>
            An error happened while loading the collection.
            <br />
            Details:
            <pre className="mt-2">
              Code: {collectionError.code}
              <br />
              Details: {collectionError.details}
              <br />
              Hint: {collectionError.hint}
              <br />
              Message: {collectionError.message}
              <br />
            </pre>
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!collection) {
    // TODO: could be a shortlink, check for that an redirect accordingly
    return notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: links, error: linksError } = await supabase
    .from('collection_link')
    .select('visible, link(*)')
    .eq('collection_pk', collection.fingerprint)

  if (linksError) {
    console.error(linksError)
    return <p>Error loading links.</p>
  }

  const canSeeHiddenLinks = user && collection.created_by === user.id

  const displayedLinks = links
    .map(({ link, visible }) => ({ ...link, visible }))
    .filter((link) => (!link?.visible ? canSeeHiddenLinks : true))

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
          {displayedLinks.map((link) => (
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
          Create your own{' '}
          <span className="mx-1 flex text-purple-500">
            Bife <Utensils className="ml-1" />
          </span>{' '}
          collection
        </NextLink>
      </div>
    </>
  )
}
