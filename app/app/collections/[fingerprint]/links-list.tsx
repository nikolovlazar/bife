import { type ColumnsType, linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'
import { getCollectionLinksController } from '@/interface-adapters/controllers/get-collection-links.controller'

export async function LinksList({ fingerprint }: { fingerprint: string }) {
  const data = await getCollectionLinksController(fingerprint)

  const links = data?.links.map((link) => ({
    ...link.link,
    visible: link.visible,
    order: link.order,
    collectionFingerprint: fingerprint,
  })) as ColumnsType[]

  return data && data.links.length > 0 ? (
    <LinksDataTable
      collectionFingerprint={fingerprint}
      data={links}
      columns={linkColumns}
    />
  ) : (
    <p>No links yet.</p>
  )
}
