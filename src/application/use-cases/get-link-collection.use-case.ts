import { inject, injectable } from 'inversify'

import type { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'
import type { ILinksRepository } from '@/application/repositories/links-repository.interface'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import { DI_TYPES } from '@/di/types'

@injectable()
export class GetLinkOrCollectionUseCase {
  constructor(
    @inject(DI_TYPES.CollectionsRepository)
    private _collectionsRepository: ICollectionsRepository,

    @inject(DI_TYPES.LinksRepository)
    private _linksRepository: ILinksRepository
  ) {}

  async execute(fingerprint: string) {
    let link: Link

    try {
      link = await this._linksRepository.getLink(fingerprint)
      return { link }
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err
      }
    }

    let collection: Collection

    try {
      collection = await this._collectionsRepository.getCollection(fingerprint)
      return { collection }
    } catch (err) {
      throw err
    }
  }
}
