import { UnauthorizedError } from '@/entities/errors/auth'
import { Link, LinkUpdate, LinkUpdateSchema } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function updateLinkUseCase(
  link: Link,
  data: LinkUpdate
): Promise<Link> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (link.created_by !== user.id) {
    throw new UnauthorizedError('Cannot update link. Reason: unauthorized.', {})
  }

  const newData = LinkUpdateSchema.parse({
    url: data.url ?? link.url,
    label: data.label ?? link.label,
  })

  const linksRepository = getInjection('ILinksRepository')
  const updatedLink = await linksRepository.updateLink(
    link.fingerprint,
    newData
  )

  return updatedLink
}
