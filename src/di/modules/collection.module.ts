import { ContainerModule, interfaces } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'
import { CollectionsUseCases } from '@/application/use-cases/collections-use-cases'

import { CollectionsRepository } from '@/infrastructure/repositories/collections-repository'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ICollectionsRepository>(DI_SYMBOLS.ICollectionsRepository).to(
    CollectionsRepository
  )
  bind<CollectionsUseCases>(DI_SYMBOLS.CollectionsUseCases).to(
    CollectionsUseCases
  )
}

export const CollectionsModule = new ContainerModule(initializeModule)
