import { redirect } from 'next/navigation'

import { UnauthenticatedError } from '@/entities/errors/auth'
import { OperationError } from '@/entities/errors/common'

import { linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'
import { CreateLink } from './create-link'
import {
  LinkRow,
  getOwnLinksController,
} from '@/interface-adapters/controllers/get-own-links.controller'

async function getLinks(page: number, pageSize: number) {
  let links: { data: LinkRow[]; totalCount: number }

  try {
    links = await getOwnLinksController(page, pageSize)
  } catch (err) {
    if (err instanceof UnauthenticatedError) {
      redirect('/signin')
    }
    if (err instanceof OperationError) {
      redirect('/error')
    }
    throw err
  }

  return links
}

export default async function LinksPage({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string }
}) {
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 20
  const { data: links, totalCount } = await getLinks(page, pageSize)

  return (
    <>
      <div className="sentry-unmask flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Links</h1>
        <CreateLink />
      </div>
      {links && links.length > 0 ? (
        <LinksDataTable
          columns={linkColumns}
          data={links}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
        />
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
