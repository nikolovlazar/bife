import { ContainerModule, interfaces } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'

import { CollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository'
import { MockCollectionLinkRepository } from '@/infrastructure/repositories/collection-link-repository.mock'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<ICollectionLinkRepository>(DI_SYMBOLS.ICollectionLinkRepository).to(
      MockCollectionLinkRepository
    )
  } else {
    bind<ICollectionLinkRepository>(DI_SYMBOLS.ICollectionLinkRepository).to(
      CollectionLinkRepository
    )
  }
}

export const CollectionLinkModule = new ContainerModule(initializeModule)
