import { createClient } from '@/infrastructure/utils/supabase/server'

import { type ColumnsType, linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'

export async function LinksList({ fingerprint }: { fingerprint: string }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collection_link')
    .select('visible, order, link(*)')
    .order('order', { ascending: true })
    .eq('collection_pk', fingerprint)

  const links = data?.map((link) => ({
    ...link.link,
    visible: link.visible,
    order: link.order,
    collectionFingerprint: fingerprint,
  })) as ColumnsType[]

  if (error) {
    console.error(error)
  }
  return data && data.length > 0 ? (
    <LinksDataTable
      collectionFingerprint={fingerprint}
      data={links}
      columns={linkColumns}
    />
  ) : (
    <p>No links yet.</p>
  )
}
