import { CollectionsRepository } from '../repositories/collectionsRepository'

import { AuthenticationService } from './authenticationService'
import { CollectionsService } from './collectionsService'

// TODO: figure out the receiving and returning types
type Services = AuthenticationService | CollectionsService
type ServiceTypes = typeof AuthenticationService | typeof CollectionsService

export class ServiceLocator {
  private static _serviceCache: Record<string, any>
  private static _repositoryCache: Record<string, any>

  static {
    console.log('Setting up cache')
    ServiceLocator._serviceCache = {}
    ServiceLocator._repositoryCache = {}
  }

  static getService(name: string) {
    const service = this._serviceCache[name]

    if (!!service) {
      console.log(`${name} service is cached! Returning the cached version.`)
      return service
    }

    console.log(`Creating and caching ${name} service...`)
    if (name === AuthenticationService.name) {
      // Note: the place to instantiate different repositories if needed
      const authenticationService = new AuthenticationService()
      this._serviceCache[name] = authenticationService
      return authenticationService
    }

    if (name === CollectionsService.name) {
      // Note: the place to instantiate different repositories if needed
      const collectionsRepository = new CollectionsRepository()
      const collectionsService = new CollectionsService(collectionsRepository)
      this._serviceCache[name] = collectionsService
      return collectionsService
    }
  }
}
