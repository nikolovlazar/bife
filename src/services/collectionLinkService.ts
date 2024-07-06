import { ServiceLocator } from './serviceLocator'
import { ICollectionLinkRepository } from '@/infrastructure/repositories'
import { CollectionLink } from '@/shared/dtos/collectionLink'
import { User } from '@/shared/dtos/users'

export class CollectionLinkService {
  constructor(private _collectionLinkRepository: ICollectionLinkRepository) {}

  async setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ) {
    const relation = await this._collectionLinkRepository.getRelation(
      collectionFingerprint,
      linkFingerprint
    )

    const collectionsService = ServiceLocator.getService('CollectionsService')
    const collection = await collectionsService.getCollection(
      relation.collection_pk
    )

    const linksService = ServiceLocator.getService('LinksService')
    const link = await linksService.getLink(relation.link_pk)

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
    const collectionsService = ServiceLocator.getService('CollectionsService')
    const collection = await collectionsService.getCollection(
      collectionFingerprint
    )

    const linksService = ServiceLocator.getService('LinksService')
    const link = await linksService.getLink(linkFingerprint)

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
    const collectionsService = ServiceLocator.getService('CollectionsService')
    const collection = await collectionsService.getCollection(
      collectionFingerprint
    )

    const linksService = ServiceLocator.getService('LinksService')
    const link = await linksService.getLink(linkFingerprint)

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
    const collectionsService = ServiceLocator.getService('CollectionsService')
    const collection = await collectionsService.getCollection(
      collectionFingerprint
    )

    const linksService = ServiceLocator.getService('LinksService')
    await Promise.all(
      linksOrder.map(({ fingerprint }) => linksService.getLink(fingerprint))
    )

    await this._collectionLinkRepository.updateLinksOrder(
      collection.fingerprint,
      linksOrder
    )
  }

  async getLinksForCollection(collectionFingerprint: string) {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    let user: User | undefined
    let shouldFilterInvisibleLinks = true

    try {
      user = await authenticationService.getUser()

      const collectionsService = ServiceLocator.getService('CollectionsService')
      const collection = await collectionsService.getCollection(
        collectionFingerprint
      )

      shouldFilterInvisibleLinks = collection.created_by !== user.id
    } catch (err) {}

    const links = await this._collectionLinkRepository.getLinksForCollection(
      collectionFingerprint
    )

    let displayedLinks = links

    if (shouldFilterInvisibleLinks) {
      displayedLinks = links.filter((link) => link.visible)
    }

    return displayedLinks
  }
}
