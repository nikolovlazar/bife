import { ContainerModule, interfaces } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import { CollectionLinkUseCases } from '@/application/use-cases/collection-link-use-cases'
import { GetLinkOrCollectionUseCase } from '@/application/use-cases/get-link-collection.use-case'

import { CollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ICollectionLinkRepository>(DI_SYMBOLS.ICollectionLinkRepository).to(
    CollectionLinkRepository
  )
  bind<CollectionLinkUseCases>(DI_SYMBOLS.CollectionLinkUseCases).to(
    CollectionLinkUseCases
  )
  bind<GetLinkOrCollectionUseCase>(DI_SYMBOLS.GetLinkOrCollectionUseCases).to(
    GetLinkOrCollectionUseCase
  )
}

export const CollectionLinkModule = new ContainerModule(initializeModule)
