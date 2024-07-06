import { Container } from 'inversify'
import 'reflect-metadata'

const ApplicationContainer = new Container({
  defaultScope: 'Singleton',
})

const initializeContainer = () => {
  // Load modules
  // ApplicationContainer.load(MODULE)
}

initializeContainer()

export { ApplicationContainer }
