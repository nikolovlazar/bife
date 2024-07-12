import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'
import { ILinksRepository } from '@/application/repositories/links-repository.interface'
import { IAuthenticationService } from '@/application/services/authentication-service.interface'
import { CollectionLinkUseCases } from '@/application/use-cases/collection-link-use-cases'
import { CollectionsUseCases } from '@/application/use-cases/collections-use-cases'
import { GetLinkOrCollectionUseCase } from '@/application/use-cases/get-link-collection.use-case'
import { LinksUseCases } from '@/application/use-cases/links-use-cases'

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),

  // Repositories
  ICollectionsRepository: Symbol.for('ICollectionsRepository'),
  ICollectionLinkRepository: Symbol.for('ICollectionLinkRepository'),
  ILinksRepository: Symbol.for('ILinksRepository'),

  // Use cases
  CollectionsUseCases: Symbol.for('CollectionsUseCases'),
  CollectionLinkUseCases: Symbol.for('CollectionLinkUseCases'),
  GetLinkOrCollectionUseCases: Symbol.for('GetLinkOrCollectionUseCases'),
  LinksUseCases: Symbol.for('LinksUseCases'),
}

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService

  // Repositories
  ICollectionsRepository: ICollectionsRepository
  ICollectionLinkRepository: ICollectionLinkRepository
  ILinksRepository: ILinksRepository

  // Use cases
  CollectionsUseCases: CollectionsUseCases
  CollectionLinkUseCases: CollectionLinkUseCases
  GetLinkOrCollectionUseCases: GetLinkOrCollectionUseCase
  LinksUseCases: LinksUseCases
}
