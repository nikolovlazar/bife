import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit'

import { AddOrCreateLink } from './add-create-link'
import { DeleteCollectionConfirmation } from './delete-collection'
import { LinksList } from './links-list'
import { createClient } from '@/utils/supabase/server'

import { updateCollection } from '../actions'

export default async function CollectionDetails({
  params,
}: {
  params: { fingerprint: string }
}) {
  const supabase = createClient()
  const { data: collection, error } = await supabase
    .from('collection')
    .select('*')
    .eq('fingerprint', params.fingerprint)
    .single()

  if (error) {
    console.error(error)
  }

  if (!collection) {
    return notFound()
  }

  const { data: userLinks, error: linksError } = await supabase
    .from('link')
    .select('*')

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
        <form action={updateCollection} className="mt-4 w-full xl:max-w-lg">
          <fieldset className="grid items-start gap-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Collection details
            </legend>
            <div className="gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="ReactConf 2024"
                defaultValue={collection?.title}
              />
            </div>
            <div className="gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder=""
                defaultValue={collection?.description ?? ''}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox
                name="published"
                id="published"
                defaultChecked={collection?.published}
                className="h-6 w-6"
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <input
              name="fingerprint"
              readOnly
              type="text"
              hidden
              aria-hidden
              aria-readonly
              value={params.fingerprint}
              className="hidden"
            />
            <SubmitButton>Update</SubmitButton>
            <DeleteCollectionConfirmation fingerprint={params.fingerprint}>
              <Button variant="destructive">Delete</Button>
            </DeleteCollectionConfirmation>
          </fieldset>
        </form>
        <form className="mt-4 flex-1">
          <fieldset className="grid items-start gap-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">Links</legend>
            <AddOrCreateLink
              userLinks={userLinks ?? []}
              linksInCollection={linksInCollection ?? []}
              collectionFingerprint={params.fingerprint}
            />
            <LinksList fingerprint={params.fingerprint} />
          </fieldset>
        </form>
      </div>
    </>
  )
}
