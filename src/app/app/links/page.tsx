import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'
import { CreateLink } from './create-link'
import { createClient } from '@/utils/supabase/server'

async function getLinks() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error('User not found')
  }

  const { data, error: collectionError } = await supabase
    .from('link')
    .select()
    .eq('created_by', user.id)

  if (collectionError) {
    throw new Error('Failed to fetch links')
  }

  return data
}
export default async function LinksPage() {
  const links = await getLinks()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <CreateLink />
      </div>
      {links && links.length > 0 ? (
        <LinksDataTable columns={linkColumns} data={links} />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no links
            </h3>
            <p className="text-sm text-muted-foreground">
              Create a link to get started
            </p>
            <CreateLink className="mt-4" variant="default" />
          </div>
        </div>
      )}
    </>
  )
}
