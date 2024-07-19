import { Link } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function getOwnLinksUseCase(): Promise<Link[]> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const linksRepository = getInjection('ILinksRepository')
  const links = await linksRepository.getLinksForUser(user.id)

  return links
}
