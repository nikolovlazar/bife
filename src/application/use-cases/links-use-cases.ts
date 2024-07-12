import { inject, injectable } from 'inversify'

import type { ILinksRepository } from '@/application/repositories/links-repository.interface'
import type { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'
import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

import { getInjection } from '@/di/container'
import { DI_SYMBOLS } from '@/di/types'

@injectable()
export class LinksUseCases {
  constructor(
    @inject(DI_SYMBOLS.IAuthenticationService)
    private _authenticationService: IAuthenticationService,
    @inject(DI_SYMBOLS.ILinksRepository)
    private _linksRepository: ILinksRepository
  ) {}

  async getPublicLink(fingerprint: string): Promise<Link> {
    const link = await this._linksRepository.getLink(fingerprint)

    return link
  }

  async getLink(fingerprint: string): Promise<Link> {
    const user = await this._authenticationService.getUser()

    const link = await this._linksRepository.getLink(fingerprint)

    if (link.created_by !== user.id) {
      throw new UnauthorizedError(
        'Cannot update link. Reason: unauthorized.',
        {}
      )
    }

    return link
  }

  async createLink(
    data: LinkInsert,
    collectionFingerprint?: string
  ): Promise<Link> {
    const user = await this._authenticationService.getUser()

    let collection: Collection | undefined
    if (collectionFingerprint) {
      const collectionsUseCases = getInjection('CollectionsUseCases')
      collection = await collectionsUseCases.getCollection(
        collectionFingerprint
      )
    }

    const newLink = await this._linksRepository.createLink(data, user.id)

    if (collection) {
      const collectionLinkUseCases = getInjection('CollectionLinkUseCases')
      await collectionLinkUseCases.addLinkToCollection(
        collection.fingerprint,
        newLink.fingerprint
      )
    }

    return newLink
  }

  async updateLink(fingerprint: string, data: LinkUpdate): Promise<Link> {
    const user = await this._authenticationService.getUser()
    const link = await this._linksRepository.getLink(fingerprint)

    if (link.created_by !== user.id) {
      throw new UnauthorizedError(
        'Cannot update link. Reason: unauthorized.',
        {}
      )
    }

    const newData = {
      url: data.url ?? link.url,
      label: data.label ?? link.label,
    }

    const updatedLink = await this._linksRepository.updateLink(
      link.fingerprint,
      newData
    )

    return updatedLink
  }

  async deleteLink(fingerprint: string): Promise<void> {
    const user = await this._authenticationService.getUser()
    const link = await this._linksRepository.getLink(fingerprint)

    if (link.created_by !== user.id) {
      throw new UnauthorizedError(
        'Cannot delete link. Reason: unauthorized.',
        {}
      )
    }

    await this._linksRepository.deleteLink(fingerprint)
  }
}
