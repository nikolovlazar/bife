import { CollectionInsert, CollectionUpdate } from '@/utils/types'

import { CollectionDTO } from '@/shared/dtos/collection'

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
