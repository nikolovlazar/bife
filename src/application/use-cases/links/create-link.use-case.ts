import { Link, LinkInsert } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function createLinkUseCase(data: LinkInsert): Promise<Link> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const linksRepository = getInjection('ILinksRepository')
  const newLink = await linksRepository.createLink(data, user.id)

  return newLink
}
