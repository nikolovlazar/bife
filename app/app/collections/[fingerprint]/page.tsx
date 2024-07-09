import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/infrastructure/utils/supabase/server'

import { AddOrCreateLink } from './add-create-link'
import { LinksList } from './links-list'
import UpdateOrDeleteCollection from './update-collection'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/web/_components/ui/breadcrumb'
import { Button } from '@/web/_components/ui/button'

export default async function CollectionDetails({
  params,
}: {
  params: { fingerprint: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const { data: collection, error } = await supabase
    .from('collection')
    .select('*')
    .eq('fingerprint', params.fingerprint)
    .single()

  if (error) {
    console.error(error)
  }

  if (userError || !user) {
    redirect('/signin')
  }

  if (!collection) {
    return notFound()
  }

  const { data: userLinks, error: linksError } = await supabase
    .from('link')
    .select('*')
    .eq('created_by', user.id)

  if (linksError) {
    console.error(linksError)
  }

  const { data: collectionLinks, error: collectionLinksError } = await supabase
    .from('collection_link')
    .select('link(*)')
    .eq('collection_pk', params.fingerprint)

  if (collectionLinksError) {
    console.error(collectionLinksError)
  }

  const linksInCollection = collectionLinks?.map(({ link }) => link!)

  return (
    <>
      <div className="flex items-center justify-between">
        <Breadcrumb className="max-md:hidden">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/app/collections">Collections</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{collection?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button asChild variant="ghost">
          <Link
            href={`/${collection?.fingerprint}`}
            target="_blank"
            className="flex items-center gap-2"
          >
            View collection page
            <ExternalLink className="w-4" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 xl:flex-row">
        <UpdateOrDeleteCollection
          title={collection.title}
          description={collection.description ?? undefined}
          fingerprint={collection.fingerprint}
          published={collection.published}
        />
        <div className="mt-4 flex-1">
          <fieldset className="grid items-start gap-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Links</legend>
            <AddOrCreateLink
              userLinks={userLinks ?? []}
              linksInCollection={linksInCollection ?? []}
              collectionFingerprint={params.fingerprint}
            />
            <LinksList fingerprint={params.fingerprint} />
          </fieldset>
        </div>
      </div>
    </>
  )
}