import { Link } from '@/entities/models/link'

import { getInjection } from '@/di/container'

export async function getLinkUseCase(fingerprint: string): Promise<Link> {
  const linksRepository = getInjection('ILinksRepository')
  const link = await linksRepository.getLink(fingerprint)

  return link
}
