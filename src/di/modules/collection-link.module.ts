import { ContainerModule, interfaces } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import { CollectionLinkUseCases } from '@/application/use-cases/collection-link-use-cases'
import { GetLinkOrCollectionUseCase } from '@/application/use-cases/get-link-collection.use-case'

import { CollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository'

import { DI_TYPES } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ICollectionLinkRepository>(DI_TYPES.CollectionLinkRepository).to(
    CollectionLinkRepository
  )
  bind<CollectionLinkUseCases>(DI_TYPES.CollectionLinkUseCases).to(
    CollectionLinkUseCases
  )
  bind<GetLinkOrCollectionUseCase>(DI_TYPES.GetLinkOrCollectionUseCases).to(
    GetLinkOrCollectionUseCase
  )
}

export const CollectionLinkModule = new ContainerModule(initializeModule)
