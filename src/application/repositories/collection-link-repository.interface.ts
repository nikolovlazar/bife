import {
  CollectionLink,
  CollectionLinks,
} from '@/entities/models/collection-link'

export interface ICollectionLinkRepository {
  setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<CollectionLink>

  addLinkToCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLink>

  removeLinkFromCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLink>

  updateLinksOrder(
    collectionFingerprint: string,
    linksOrder: { fingerprint: string; order: number }[]
  ): Promise<void>

  getLinksForCollection(collectionFingerprint: string): Promise<CollectionLinks>
}
