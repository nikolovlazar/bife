import { ContainerModule, interfaces } from 'inversify'

import { ICacheService } from '@/application/services/cache-service.interface'

import { CacheService } from '@/infrastructure/services/cache-service'
import { MockCacheService } from '@/infrastructure/services/cache-service.mock'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === 'test') {
    bind<ICacheService>(DI_SYMBOLS.ICacheService).to(MockCacheService)
  } else {
    bind<ICacheService>(DI_SYMBOLS.ICacheService).to(CacheService)
  }
}

export const CacheModule = new ContainerModule(initializeModule)
