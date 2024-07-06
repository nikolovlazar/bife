import {
  CollectionInsert,
  CollectionUpdate,
  LinkInsert,
  LinkUpdate,
} from '@/utils/types'

import { Collection } from '@/shared/dtos/collection'
import {
  CollectionLink,
  CollectionLinks,
} from '@/shared/dtos/collectionLink'
import { Link } from '@/shared/dtos/link'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionInsert,
    userId: string
  ): Promise<Collection>

  getCollection(fingerprint: string): Promise<Collection>

  getUsersCollection(
    fingerprint: string,
    userId: string
  ): Promise<Collection>

  updateCollection(
    fingerprint: string,
    input: CollectionUpdate
  ): Promise<Collection>

  deleteCollection(fingerprint: string): Promise<Collection>
}

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<Link>

  createLink(link: LinkInsert, userId: string): Promise<Link>

  updateLink(fingerprint: string, link: LinkUpdate): Promise<Link>

  deleteLink(fingerprint: string): Promise<void>

  setLinkVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<Link>
}

export interface ICollectionLinkRepository {
  getRelation(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLink>

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
