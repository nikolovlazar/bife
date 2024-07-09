import {
  Collection,
  CollectionInsert,
  CollectionUpdate,
} from '@/entities/models/collection'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionInsert,
    userId: string
  ): Promise<Collection>

  getCollection(fingerprint: string): Promise<Collection>

  getUsersCollection(fingerprint: string, userId: string): Promise<Collection>

  updateCollection(
    fingerprint: string,
    input: CollectionUpdate
  ): Promise<Collection>

  deleteCollection(fingerprint: string): Promise<Collection>
}
