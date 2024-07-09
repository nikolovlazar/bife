import { Container } from 'inversify'

import { AuthenticationModule } from './modules/authentication.module'
import { CollectionLinkModule } from './modules/collection-link.module'
import { CollectionsModule } from './modules/collection.module'
import { LinksModule } from './modules/links.module'

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

export const getInjection = <T>(symbol: symbol) => {
  return ApplicationContainer.get<T>(symbol)
}

export { ApplicationContainer }
