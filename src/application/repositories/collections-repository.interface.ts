import {
  Collection,
  CollectionInsert,
  CollectionUpdate,
} from '@/entities/models/collection'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionInsert,
    userId: string,
    fingerprint: string
  ): Promise<Collection>

  getCollection(fingerprint: string): Promise<Collection>

  getCollectionsForUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ collections: Collection[]; totalCount: number }>

  updateCollection(
    fingerprint: string,
    input: CollectionUpdate
  ): Promise<Collection>

  deleteCollection(fingerprint: string): Promise<Collection>
}
