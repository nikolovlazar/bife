import { LinkInsert, LinkUpdate } from '@/utils/types'

import { ServiceLocator } from './serviceLocator'
import { ILinksRepository } from '@/repositories'
import { CollectionDTO } from '@/shared/dtos/collection'
import { LinkDTO } from '@/shared/dtos/link'
import { UnauthorizedError } from '@/shared/errors/authErrors'

export class LinksService {
  constructor(private _linksRepository: ILinksRepository) {}

  async getPublicLink(fingerprint: string): Promise<LinkDTO> {
    const link = await this._linksRepository.getLink(fingerprint)

    return link
  }

  async getLink(fingerprint: string): Promise<LinkDTO> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
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
  ): Promise<LinkDTO> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    const user = await authenticationService.getUser()

    const collectionsService = ServiceLocator.getService('CollectionsService')

    let collection: CollectionDTO | undefined
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

  async updateLink(fingerprint: string, data: LinkUpdate): Promise<LinkDTO> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
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
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
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
