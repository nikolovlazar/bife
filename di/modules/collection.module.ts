import { ContainerModule, interfaces } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

import { CollectionsRepository } from '@/infrastructure/repositories/collections-repository'
import { MockCollectionsRepository } from '@/infrastructure/repositories/collections-repository.mock'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<ICollectionsRepository>(DI_SYMBOLS.ICollectionsRepository).to(
      MockCollectionsRepository
    )
  } else {
    bind<ICollectionsRepository>(DI_SYMBOLS.ICollectionsRepository).to(
      CollectionsRepository
    )
  }
}

export const CollectionsModule = new ContainerModule(initializeModule)
