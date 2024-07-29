import { Collection } from '@/entities/models/collection'

import { getInjection } from '~/di/container'

export async function getOwnCollectionsUseCase(): Promise<Collection[]> {
  const authenticationService = getInjection('IAuthenticationService')
  const user = await authenticationService.getUser()

  const collectionsRepository = getInjection('ICollectionsRepository')
  const collections = await collectionsRepository.getCollectionsForUser(user.id)

  return collections
}
