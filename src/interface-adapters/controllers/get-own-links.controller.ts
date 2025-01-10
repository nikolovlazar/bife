import dayjs from 'dayjs'

import { getOwnLinksUseCase } from '@/application/use-cases/links/get-own-links.use-case'

import { Link } from '@/entities/models/link'

function presenter(links: Link[]) {
  return links.map((link) => ({
    fingerprint: link.fingerprint,
    url: link.url,
    label: link.label,
    created_at: dayjs(link.created_at).format('MMM D, YYYY'),
    created_by: link.created_by,
  }))
}

type PresenterOutput = ReturnType<typeof presenter>
export type LinkRow = PresenterOutput[0]

export async function getOwnLinksController(
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: ReturnType<typeof presenter>; totalCount: number }> {
  const { links, totalCount } = await getOwnLinksUseCase(page, pageSize)

  return {
    data: presenter(links),
    totalCount,
  }
}
