import { Link } from '@/entities/models/link'

import { getInjection } from '~/di/container'

export async function getLinkUseCase(fingerprint: string): Promise<Link> {
  const linksRepository = getInjection('ILinksRepository')
  const link = await linksRepository.getLink(fingerprint)

  const cacheService = getInjection('ICacheService')
  await cacheService.setCachedLink(fingerprint, link)

  return link
}
