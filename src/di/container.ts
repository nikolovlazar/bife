import { Container } from 'inversify'
import 'reflect-metadata'

import { AuthenticationModule } from './modules/authentication.module'

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
})

const initializeContainer = () => {
  ApplicationContainer.load(AuthenticationModule)
}

initializeContainer()

export const inject = <T>(symbol: symbol) => {
  return ApplicationContainer.get<T>(symbol)
}

export { ApplicationContainer }
