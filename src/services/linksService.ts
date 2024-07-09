import { ILinksRepository } from '@/application/repositories/links-repository.interface'
import { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { UnauthorizedError } from '@/entities/errors/auth'
import { Collection } from '@/entities/models/collection'
import { Link, LinkInsert, LinkUpdate } from '@/entities/models/link'

import { ServiceLocator } from './serviceLocator'
import { inject } from '@/di/container'
import { DI_TYPES } from '@/di/types'

export class LinksService {
  constructor(private _linksRepository: ILinksRepository) {}

  async getPublicLink(fingerprint: string): Promise<Link> {
    const link = await this._linksRepository.getLink(fingerprint)

    return link
  }

  async getLink(fingerprint: string): Promise<Link> {
    const authenticationService = inject<IAuthenticationService>(
      DI_TYPES.AuthenticationService
    )
    const user = await authenticationService.getUser()

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
    const authenticationService = inject<IAuthenticationService>(
      DI_TYPES.AuthenticationService
    )
    const user = await authenticationService.getUser()

    const collectionsService = ServiceLocator.getService('CollectionsService')

    let collection: Collection | undefined
    if (collectionFingerprint) {
      collection = await collectionsService.getCollection(collectionFingerprint)
    }

    const newLink = await this._linksRepository.createLink(data, user.id)

    if (collection) {
      const collectionLinkService = ServiceLocator.getService(
        'CollectionLinkService'
      )
      await collectionLinkService.addLinkToCollection(
        collection.fingerprint,
        newLink.fingerprint
      )
    }

    return newLink
  }

  async updateLink(fingerprint: string, data: LinkUpdate): Promise<Link> {
    const authenticationService = inject<IAuthenticationService>(
      DI_TYPES.AuthenticationService
    )
    const user = await authenticationService.getUser()
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
    const authenticationService = inject<IAuthenticationService>(
      DI_TYPES.AuthenticationService
    )
    const user = await authenticationService.getUser()
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
