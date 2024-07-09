import { ContainerModule, interfaces } from 'inversify'

import { ILinksRepository } from '@/application/repositories/links-repository.interface'
import { LinksUseCases } from '@/application/use-cases/links-use-cases'

import { LinksRepository } from '@/infrastructure/repositories/links-repository'

import { DI_TYPES } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ILinksRepository>(DI_TYPES.LinksRepository).to(LinksRepository)
  bind<LinksUseCases>(DI_TYPES.LinksUseCases).to(LinksUseCases)
}

export const LinksModule = new ContainerModule(initializeModule)
