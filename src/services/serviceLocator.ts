import { CollectionsRepository } from '../repositories/collectionsRepository'

import { AuthenticationService } from './authenticationService'
import { CollectionsService } from './collectionsService'

export class ServiceLocator {
  private static _cache: Record<string, any>

  static {
    console.log('Setting up cache')
    ServiceLocator._cache = {}
  }

  static getService(name: string) {
    const service = this._cache[name]

    if (!!service) {
      console.log(`${name} service is cached! Returning the cached version.`)
      return service
    }

    console.log(`Creating and caching ${name} service...`)
    if (name === AuthenticationService.name) {
      const authenticationService = new AuthenticationService()
      this._cache[name] = authenticationService
      return authenticationService
    }

    if (name === CollectionsService.name) {
      // Note: the place to instantiate different repositories if needed
      const collectionsRepository = new CollectionsRepository()
      const collectionsService = new CollectionsService(collectionsRepository)
      this._cache[name] = collectionsService
      return collectionsService
    }
  }
}
