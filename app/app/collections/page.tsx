import { createClient } from '@/utils/supabase/server'

import { collectionColumns } from './_collections-table/columns'
import { CollectionsDataTable } from './_collections-table/table'
import CreateCollection from './create-collection'

async function getCollections() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('User not found')
  }

  const { data, error: collectionError } = await supabase
    .from('collection')
    .select()
    .eq('created_by', user.id)

  if (collectionError) {
    throw new Error('Failed to fetch collections')
  }

  return data
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
