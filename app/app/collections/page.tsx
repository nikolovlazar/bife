import { collectionColumns } from './_collections-table/columns'
import { CollectionsDataTable } from './_collections-table/table'
import CreateCollection from './create-collection'
import { getInjection } from '@/di/container'

async function getCollections() {
  const collectionsUseCases = getInjection('CollectionsUseCases')

  const collections = await collectionsUseCases.getOwnCollections()

  return collections
}

export default async function Collections() {
  const collections = await getCollections()

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Collections</h1>
        <CreateCollection />
      </div>
      {collections && collections.length > 0 ? (
        <CollectionsDataTable columns={collectionColumns} data={collections} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no link collections
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Create a collection to get started
            </p>
            <CreateCollection />
          </div>
        </div>
      )}
    </>
  )
}
