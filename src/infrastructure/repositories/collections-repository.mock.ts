import { injectable } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

import {
  NotFoundError,
  UniqueConstraintViolationError,
} from '@/entities/errors/common'
import {
  Collection,
  CollectionInsert,
  CollectionSchema,
  CollectionUpdate,
  CollectionUpdateSchema,
  CollectionsSchema,
} from '@/entities/models/collection'

@injectable()
export class MockCollectionsRepository implements ICollectionsRepository {
  private _collections: Collection[]

  constructor() {
    this._collections = []
  }

  createCollection(
    collection: CollectionInsert,
    userId: string,
    fingerprint: string
  ): Promise<Collection> {
    const existingCollection = this._collections.find(
      (collection) => collection.fingerprint === fingerprint
    )

    if (existingCollection) {
      throw new UniqueConstraintViolationError(
        'duplicate key value violates unique constraint'
      )
    }

    const { title, description } = collection

    const newCollection: Collection = {
      fingerprint,
      title,
      description,
      published: true,
      created_by: userId,
      created_at: new Date().toUTCString(),
    }

    this._collections.push(newCollection)

    return Promise.resolve(CollectionSchema.parse(newCollection))
  }

  getCollection(fingerprint: string): Promise<Collection> {
    const collection = this._collections.find(
      (c) => c.fingerprint === fingerprint
    )

    if (!collection) {
      throw new NotFoundError('Cannot find a collection with that fingerprint')
    }

    return Promise.resolve(CollectionSchema.parse(collection))
  }

  getCollectionsForUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ collections: Collection[]; totalCount: number }> {
    const collections = this._collections.filter(
      (collection) => collection.created_by === userId
    )

    const totalCount = collections.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedCollections = collections.slice(startIndex, endIndex)

    return Promise.resolve({
      collections: CollectionsSchema.parse(paginatedCollections),
      totalCount,
    })
  }

  updateCollection(
    fingerprint: string,
    input: CollectionUpdate
  ): Promise<Collection> {
    const collectionIndex = this._collections.findIndex(
      (collection) => collection.fingerprint === fingerprint
    )

    if (collectionIndex < 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    const data = CollectionUpdateSchema.parse(input)

    let collection = this._collections[collectionIndex]

    collection = { ...collection, ...data }

    this._collections[collectionIndex] = collection

    return Promise.resolve(CollectionSchema.parse(collection))
  }

  deleteCollection(fingerprint: string): Promise<Collection> {
    const collectionIndex = this._collections.findIndex(
      (collection) => collection.fingerprint === fingerprint
    )

    if (collectionIndex < 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    const collection = this._collections[collectionIndex]

    delete this._collections[collectionIndex]
    this._collections = this._collections.filter(Boolean)

    return Promise.resolve(CollectionSchema.parse(collection))
  }
}
