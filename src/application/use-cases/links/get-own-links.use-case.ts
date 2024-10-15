import { Link } from '@/entities/models/link'

import { getInjection } from '~/di/container'

export async function getOwnLinksUseCase(
  page: number,
  pageSize: number
): Promise<{ links: Link[]; totalCount: number }> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const linksRepository = getInjection('ILinksRepository')
  const { links, totalCount } = await linksRepository.getLinksForUser(
    user.id,
    page,
    pageSize
  )

  return { links, totalCount }
}
