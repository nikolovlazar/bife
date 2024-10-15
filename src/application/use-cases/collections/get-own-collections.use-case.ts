import { Collection } from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function getOwnCollectionsUseCase(
  page: number = 1,
  pageSize: number = 10
): Promise<{ collections: Collection[]; totalCount: number }> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const collectionsRepository = getInjection('ICollectionsRepository')
  const { collections, totalCount } =
    await collectionsRepository.getCollectionsForUser(user.id, page, pageSize)

  return { collections, totalCount }
}
