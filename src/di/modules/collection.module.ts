import { ContainerModule, interfaces } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'
import { CollectionsUseCases } from '@/application/use-cases/collections-use-cases'

import { CollectionsRepository } from '@/infrastructure/repositories/collections-repository'

import { DI_TYPES } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ICollectionsRepository>(DI_TYPES.CollectionsRepository).to(
    CollectionsRepository
  )
  bind<CollectionsUseCases>(DI_TYPES.CollectionsUseCases).to(
    CollectionsUseCases
  )
}

export const CollectionsModule = new ContainerModule(initializeModule)
