import { ContainerModule, interfaces } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'

import { CollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ICollectionLinkRepository>(DI_SYMBOLS.ICollectionLinkRepository).to(
    CollectionLinkRepository
  )
}

export const CollectionLinkModule = new ContainerModule(initializeModule)
