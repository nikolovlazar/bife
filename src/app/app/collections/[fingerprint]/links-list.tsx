import Link from 'next/link'

import { linkColumns } from './_links-table/columns'
import { LinksDataTable } from './_links-table/table'
import { createClient } from '@/utils/supabase/server'

export async function LinksList({ fingerprint }: { fingerprint: string }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('link')
    .select('*')
    .eq('collection', fingerprint)
  if (error) {
    console.error(error)
  }
  return data && data.length > 0 ? (
    <LinksDataTable data={data} columns={linkColumns} />
  ) : (
    <p>No links yet.</p>
  )
}
