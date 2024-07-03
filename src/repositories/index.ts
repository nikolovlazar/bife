import {
  CollectionInsert,
  CollectionUpdate,
  LinkInsert,
  LinkUpdate,
} from '@/utils/types'

import { CollectionDTO } from '@/shared/dtos/collection'
import {
  CollectionLinkDTO,
  CollectionLinkDTO,
  CollectionLinksDTO,
} from '@/shared/dtos/collectionLink'
import { LinkDTO } from '@/shared/dtos/link'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionInsert,
    userId: string
  ): Promise<CollectionDTO>

  getCollection(fingerprint: string): Promise<CollectionDTO>

  getUsersCollection(
    fingerprint: string,
    userId: string
  ): Promise<CollectionDTO>

  updateCollection(
    fingerprint: string,
    input: CollectionUpdate
  ): Promise<CollectionDTO>

  deleteCollection(fingerprint: string): Promise<CollectionDTO>
}

export interface ILinksRepository {
  getLink(fingerprint: string): Promise<LinkDTO>

  createLink(link: LinkInsert, userId: string): Promise<LinkDTO>

  updateLink(fingerprint: string, link: LinkUpdate): Promise<LinkDTO>

  deleteLink(fingerprint: string): Promise<void>

  setLinkVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<LinkDTO>
}

export interface ICollectionLinkRepository {
  getRelation(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLinkDTO>

  setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<CollectionLinkDTO>

  addLinkToCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLinkDTO>

  removeLinkFromCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ): Promise<CollectionLinkDTO>

  updateLinksOrder(
    collectionFingerprint: string,
    linksOrder: { fingerprint: string; order: number }[]
  ): Promise<void>

  getLinksForCollection(collectionFingerprint: string): Promise<CollectionLinksDTO>
}
