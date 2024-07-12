import { inject, injectable } from 'inversify'

import type { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import type { IAuthenticationService } from '@/application/services/authentication-service.interface'

import { NotFoundError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import {
  CollectionLink,
  CollectionLinks,
} from '@/entities/models/collection-link'
import { User } from '@/entities/models/users'

import { getInjection } from '@/di/container'
import { DI_TYPES } from '@/di/types'

@injectable()
export class CollectionLinkUseCases {
  constructor(
    @inject(DI_TYPES.AuthenticationService)
    private _authenticationService: IAuthenticationService,
    @inject(DI_TYPES.CollectionLinkRepository)
    private _collectionLinkRepository: ICollectionLinkRepository
  ) {}

  async setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ) {
    const relation = await this._collectionLinkRepository.getRelation(
      collectionFingerprint,
      linkFingerprint
    )

    const collectionsUseCases = getInjection('CollectionsUseCases')
    const collection = await collectionsUseCases.getCollection(
      relation.collection_pk
    )

    const linksUseCases = getInjection('LinksUseCases')
    const link = await linksUseCases.getLink(relation.link_pk)

    const updated = await this._collectionLinkRepository.setVisibility(
      collection.fingerprint,
      link.fingerprint,
      visibility
    )

    return updated
  }

  async addLinkToCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLink> {
    const collectionsUseCases = getInjection('CollectionsUseCases')
    const collection = await collectionsUseCases.getCollection(
      collectionFingerprint
    )

    const linksUseCases = getInjection('LinksUseCases')
    const link = await linksUseCases.getLink(linkFingerprint)

    const relation = await this._collectionLinkRepository.addLinkToCollection(
      collection.fingerprint,
      link.fingerprint
    )

    return relation
  }

  async removeLinkFromCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLink> {
    const collectionsUseCases = getInjection('CollectionsUseCases')
    const collection = await collectionsUseCases.getCollection(
      collectionFingerprint
    )

    const linksUseCases = getInjection('LinksUseCases')
    const link = await linksUseCases.getLink(linkFingerprint)

    const relation =
      await this._collectionLinkRepository.removeLinkFromCollection(
        collection.fingerprint,
        link.fingerprint
      )

    return relation
  }

  async updateLinksOrder(
    collectionFingerprint: string,
    linksOrder: { fingerprint: string; order: number }[]
  ) {
    const collectionsUseCases = getInjection('CollectionsUseCases')
    const collection = await collectionsUseCases.getCollection(
      collectionFingerprint
    )

    const linksUseCases = getInjection('LinksUseCases')
    await Promise.all(
      linksOrder.map(({ fingerprint }) => linksUseCases.getLink(fingerprint))
    )

    await this._collectionLinkRepository.updateLinksOrder(
      collection.fingerprint,
      linksOrder
    )
  }

  async getLinksForCollection(collection: Collection) {
    let user: User | undefined
    let shouldFilterInvisibleLinks = true

    try {
      user = await this._authenticationService.getUser()

      shouldFilterInvisibleLinks = collection.created_by !== user.id
    } catch (err) {}

    let links: CollectionLinks = []

    try {
      links = await this._collectionLinkRepository.getLinksForCollection(
        collection.fingerprint
      )
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        // TODO: send this to Sentry
        throw err
      }
    }

    let displayedLinks = links

    if (shouldFilterInvisibleLinks) {
      displayedLinks = links.filter((link) => link.visible)
    }

    return displayedLinks
  }
}
