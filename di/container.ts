import { Container } from 'inversify'

import { AuthenticationModule } from './modules/authentication.module'
import { CacheModule } from './modules/cache.module'
import { CollectionLinkModule } from './modules/collection-link.module'
import { CollectionsModule } from './modules/collection.module'
import { LinksModule } from './modules/links.module'
import { DI_RETURN_TYPES, DI_SYMBOLS } from './types'

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
})

export const initializeContainer = () => {
  ApplicationContainer.load(AuthenticationModule)
  ApplicationContainer.load(CollectionsModule)
  ApplicationContainer.load(CollectionLinkModule)
  ApplicationContainer.load(LinksModule)
  ApplicationContainer.load(CacheModule)
}

export const destroyContainer = () => {
  ApplicationContainer.unload(AuthenticationModule)
  ApplicationContainer.unload(CollectionsModule)
  ApplicationContainer.unload(CollectionLinkModule)
  ApplicationContainer.unload(LinksModule)
  ApplicationContainer.unload(CacheModule)
}

if (process.env.NODE_ENV !== 'test') {
  initializeContainer()
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol])
}

export { ApplicationContainer }
