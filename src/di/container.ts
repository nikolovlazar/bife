import { Container } from 'inversify'

import { AuthenticationModule } from './modules/authentication.module'
import { CollectionLinkModule } from './modules/collection-link.module'
import { CollectionsModule } from './modules/collection.module'
import { LinksModule } from './modules/links.module'
import { DI_RETURN_TYPES } from './types'

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
})

const initializeContainer = () => {
  ApplicationContainer.load(AuthenticationModule)
  ApplicationContainer.load(CollectionsModule)
  ApplicationContainer.load(CollectionLinkModule)
  ApplicationContainer.load(LinksModule)
}

initializeContainer()

export function getInjection<K extends keyof DI_RETURN_TYPES>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(symbol)
}

export { ApplicationContainer }
