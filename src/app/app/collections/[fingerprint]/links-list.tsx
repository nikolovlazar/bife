import { linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'
import { createClient } from '@/utils/supabase/server'
import type { Collection, Link } from '@/utils/types'

type ColumnsType = Link & { collectionFingerprint: Collection['fingerprint'] }

export async function LinksList({ fingerprint }: { fingerprint: string }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('collection_link')
    .select('link(*)')
    .eq('collection_pk', fingerprint)
  const links = data?.map((link) => ({
    ...link.link,
    collectionFingerprint: fingerprint,
  })) as ColumnsType[]

  if (error) {
    console.error(error)
  }
  return data && data.length > 0 ? (
    <LinksDataTable data={links} columns={linkColumns} />
  ) : (
    <p>No links yet.</p>
  )
}
