import { redirect } from 'next/navigation'

import { createClient } from '@/infrastructure/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { fingerprint: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/signin')
  }

  const linksOrder = (await request.json()) as {
    fingerprint: string
    order: number
  }[]

  const collectionFingerprint = params.fingerprint

  if (!collectionFingerprint || !linksOrder) {
    throw new Error('Both Link and Colleciton are required')
  }

  const { error: updatedOrderError } = await supabase
    .from('collection_link')
    .upsert(
      linksOrder.map(({ fingerprint, order }) => ({
        link_pk: fingerprint,
        collection_pk: collectionFingerprint,
        order,
      })),
      { onConflict: 'link_pk,collection_pk' }
    )
    .select('order,visible,link(*)')

  if (updatedOrderError) {
    throw new Error('Failed to update links order', {
      cause: updatedOrderError,
    })
  }

  return Response.json({ success: true }, { status: 200 })
}
