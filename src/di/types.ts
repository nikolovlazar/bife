import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'
import { ILinksRepository } from '@/application/repositories/links-repository.interface'
import { IAuthenticationService } from '@/application/services/authentication-service.interface'

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),

  // Repositories
  ICollectionsRepository: Symbol.for('ICollectionsRepository'),
  ICollectionLinkRepository: Symbol.for('ICollectionLinkRepository'),
  ILinksRepository: Symbol.for('ILinksRepository'),
}

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService

  // Repositories
  ICollectionsRepository: ICollectionsRepository
  ICollectionLinkRepository: ICollectionLinkRepository
  ILinksRepository: ILinksRepository
}
