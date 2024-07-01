import { CollectionsRepository } from '../repositories/collectionsRepository'

import { AuthenticationService } from './authenticationService'
import { CollectionsService } from './collectionsService'

interface ServiceMap {
  AuthenticationService: AuthenticationService
  CollectionsService: CollectionsService
}

interface RepositoryMap {
  CollectionsRepository: CollectionsRepository
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
  }

  private static _repositoryFactory: {
    [K in keyof RepositoryMap]: () => RepositoryMap[K]
  } = {
    CollectionsRepository: () => new CollectionsRepository(),
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
