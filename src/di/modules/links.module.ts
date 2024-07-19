import { ContainerModule, interfaces } from 'inversify'

import { ILinksRepository } from '@/application/repositories/links-repository.interface'

import { LinksRepository } from '@/infrastructure/repositories/links-repository'

import { DI_SYMBOLS } from '../types'

const initializeModule = (bind: interfaces.Bind) => {
  bind<ILinksRepository>(DI_SYMBOLS.ILinksRepository).to(LinksRepository)
}

export const LinksModule = new ContainerModule(initializeModule)
