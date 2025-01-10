import { notFound } from 'next/navigation'

import { AddOrCreateLink } from './add-create-link'
import { LinksList } from './links-list'
import UpdateOrDeleteCollection from './update-collection'
import { getCollectionLinksController } from '@/interface-adapters/controllers/get-collection-links.controller'
import { getCollectionController } from '@/interface-adapters/controllers/get-collection.controller'
import { getOwnLinksController } from '@/interface-adapters/controllers/get-own-links.controller'

export default async function CollectionDetails({
  params,
}: {
  params: { fingerprint: string }
}) {
  const collection = await getCollectionController(params.fingerprint)

  if (!collection) {
    return notFound()
  }

  const { data: userLinks } = await getOwnLinksController()
  const collectionLinks = await getCollectionLinksController(params.fingerprint)

  const linksInCollection = collectionLinks.links.map(({ link }) => link!)

  return (
    <div className="flex flex-col gap-4 pb-12 xl:flex-row">
      <UpdateOrDeleteCollection
        title={collection.title}
        description={collection.description ?? undefined}
        fingerprint={collection.fingerprint}
        published={collection.published}
      />
      <div className="flex-1">
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
  )
}
