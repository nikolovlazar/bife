import { CollectionsRepository } from '../infrastructure/repositories/collections-repository'

import { AuthenticationService } from './authenticationService'
import { CollectionLinkService } from './collectionLinkService'
import { CollectionsService } from './collectionsService'
import { LinksService } from './linksService'
import {
  ICollectionLinkRepository,
  ICollectionsRepository,
  ILinksRepository,
} from '@/infrastructure/repositories'
import { CollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository'
import { LinksRepository } from '@/infrastructure/repositories/links-repository'

interface ServiceMap {
  AuthenticationService: AuthenticationService
  CollectionsService: CollectionsService
  LinksService: LinksService
  CollectionLinkService: CollectionLinkService
}

interface RepositoryMap {
  CollectionsRepository: ICollectionsRepository
  LinksRepository: ILinksRepository
  CollectionLinkRepository: ICollectionLinkRepository
}

export class ServiceLocator {
  private static _serviceCache: Partial<Record<keyof ServiceMap, any>> = {}
  private static _repositoryCache: Partial<Record<keyof RepositoryMap, any>> =
    {}

  private static _serviceFactory: {
    [K in keyof ServiceMap]: () => ServiceMap[K]
  } = {
    AuthenticationService: () => new AuthenticationService(),
    CollectionsService: () => {
      const collectionsRepository = ServiceLocator.getOrCreateRepository(
        'CollectionsRepository'
      )
      return new CollectionsService(collectionsRepository)
    },
    LinksService: () => {
      const linksRepository =
        ServiceLocator.getOrCreateRepository('LinksRepository')

      return new LinksService(linksRepository)
    },
    CollectionLinkService: () => {
      const collectionLinkRepository = ServiceLocator.getOrCreateRepository(
        'CollectionLinkRepository'
      )

      return new CollectionLinkService(collectionLinkRepository)
    },
  }

  private static _repositoryFactory: {
    [K in keyof RepositoryMap]: () => RepositoryMap[K]
  } = {
    CollectionsRepository: () => new CollectionsRepository(),
    LinksRepository: () => new LinksRepository(),
    CollectionLinkRepository: () => new CollectionLinkRepository(),
  }

  private static getOrCreateRepository<T extends keyof RepositoryMap>(
    name: T
  ): RepositoryMap[T] {
    let repository = this._repositoryCache[name]

    if (repository) {
      console.log(`${name} repository is cached! Returning the cached version.`)
      return repository
    }

    console.log(`Creating ${name} repository...`)
    repository = this._repositoryFactory[name]()

    console.log(`Caching ${name} repository...`)
    this._repositoryCache[name] = repository
    return repository
  }

  static getService<T extends keyof ServiceMap>(name: T): ServiceMap[T] {
    const service = this._serviceCache[name]

    if (service) {
      console.log(`${name} service is cached! Returning the cached version.`)
      return service
    }

    console.log(`Creating ${name} service...`)
    const createdService = this._serviceFactory[name]()

    console.log(`Caching ${name} service...`)
    this._serviceCache[name] = createdService
    return createdService
  }
}
