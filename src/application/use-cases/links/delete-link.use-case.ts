import { UnauthorizedError } from '@/entities/errors/auth'
import { Link } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function deleteLinkUseCase(link: Link): Promise<void> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  if (link.created_by !== user.id) {
    throw new UnauthorizedError('Cannot delete link. Reason: Unauthorized')
  }

  const linksRepository = getInjection('ILinksRepository')
  await linksRepository.deleteLink(link.fingerprint)
}
