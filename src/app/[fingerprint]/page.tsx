import { Utensils } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

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
    .from('link_collection')
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
    return notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: links, error: linksError } = await supabase
    .from('link')
    .select('*')
    .eq('collection', collection.fingerprint)

  const canSeeHiddenLinks = user && collection.created_by === user.id

  if (linksError) {
    console.error(linksError)
    return <p>Error loading links.</p>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{collection.title}</CardTitle>
          <CardDescription>{collection.description}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex-1 flex flex-col justify-between gap-8">
        <div className="flex flex-1 flex-col gap-4">
          {links
            .filter((link) => (!link.visible ? canSeeHiddenLinks : true))
            .map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener nofollow"
                className="flex flex-row gap-4 group font-semibold items-center bg-background shadow rounded-sm py-2 px-4"
              >
                <span>🔗</span>
                <span>{link.description}</span>
                <span className="text-xs text-muted-foreground group-hover:text-purple-500 font-normal">
                  {link.url}
                </span>
              </a>
            ))}
        </div>
        <Link
          href="/"
          className="bg-background rounded-md shadow flex px-3 py-2 w-max self-center"
        >
          Create your own{' '}
          <span className="text-purple-500 flex mx-1">
            Bife <Utensils className="ml-1" />
          </span>{' '}
          collection
        </Link>
      </div>
    </>
  )
}
