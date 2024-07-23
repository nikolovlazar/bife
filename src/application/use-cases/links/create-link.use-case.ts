import { nanoid } from 'nanoid'

import { Link, LinkInsert } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function createLinkUseCase(data: LinkInsert): Promise<Link> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const fingerprint = nanoid(8)

  const linksRepository = getInjection('ILinksRepository')
  const newLink = await linksRepository.createLink(data, user.id, fingerprint)

  return newLink
}
