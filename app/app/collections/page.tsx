import { redirect } from 'next/navigation'

import { UnauthenticatedError } from '@/entities/errors/auth'
import { OperationError } from '@/entities/errors/common'

import { collectionColumns } from './_collections-table/columns'
import { CollectionsDataTable } from './_collections-table/table'
import CreateCollection from './create-collection'
import {
  GetCollectionsTableControllerOutput,
  getCollectionsTableController,
} from '@/interface-adapters/controllers/get-collections-table.controller'

async function getCollections() {
  let collections: GetCollectionsTableControllerOutput

  try {
    collections = await getCollectionsTableController()
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      redirect('/signin')
    }
    if (err instanceof OperationError) {
      redirect('/error')
    }
    throw err
  }

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
