import { injectable } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

import {
  NotFoundError,
  UniqueConstraintViolationError,
} from '@/entities/errors/common'
import {
  Collection,
  CollectionInsert,
  CollectionInsertSchema,
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

    CollectionInsertSchema.parse(collection)

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

    return Promise.resolve(newCollection)
  }

  getCollection(fingerprint: string): Promise<Collection> {
    const collection = this._collections.find(
      (collection) => collection.fingerprint === fingerprint
    )

    if (!collection) {
      throw new NotFoundError('Cannot find a collection with that fingerprint')
    }

    return Promise.resolve(collection)
  }
  getCollectionsForUser(userId: string): Promise<
    {
      fingerprint: string
      title: string
      published: boolean
      created_by: string
      created_at: string
      description?: string | null | undefined
    }[]
  > {
    throw new Error('Method not implemented.')
  }
  getUsersCollection(
    fingerprint: string,
    userId: string
  ): Promise<{
    fingerprint: string
    title: string
    published: boolean
    created_by: string
    created_at: string
    description?: string | null | undefined
  }> {
    throw new Error('Method not implemented.')
  }
  updateCollection(
    fingerprint: string,
    input: {
      title: string
      published: boolean
      description?: string | null | undefined
    }
  ): Promise<{
    fingerprint: string
    title: string
    published: boolean
    created_by: string
    created_at: string
    description?: string | null | undefined
  }> {
    throw new Error('Method not implemented.')
  }
  deleteCollection(fingerprint: string): Promise<{
    fingerprint: string
    title: string
    published: boolean
    created_by: string
    created_at: string
    description?: string | null | undefined
  }> {
    throw new Error('Method not implemented.')
  }
}
