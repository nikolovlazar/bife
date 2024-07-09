import { Container } from 'inversify'

import { AuthenticationModule } from './modules/authentication.module'

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
})

const initializeContainer = () => {
  console.log('============ Initializing DI container')
  ApplicationContainer.load(AuthenticationModule)
}

initializeContainer()

export const inject = <T>(symbol: symbol) => {
  return ApplicationContainer.get<T>(symbol)
}

export { ApplicationContainer }
