import { ServiceLocator } from './serviceLocator'
import {
  Collection,
  CollectionInsert,
  CollectionUpdate,
} from '@/entities/models/collection'
import { UnauthorizedError } from '@/entities/errors/auth'
import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

export class CollectionsService {
  constructor(private _collectionsRepository: ICollectionsRepository) {}

  async createCollection(collection: CollectionInsert): Promise<Collection> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    const user = await authenticationService.getUser()

    const newCollection = await this._collectionsRepository.createCollection(
      collection,
      user.id
    )

    return newCollection
  }

  async getPublicCollection(fingerprint: string): Promise<Collection> {
    const collection =
      await this._collectionsRepository.getCollection(fingerprint)
    return collection
  }

  async getCollection(fingerprint: string): Promise<Collection> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    const user = await authenticationService.getUser()

    const collection =
      await this._collectionsRepository.getCollection(fingerprint)

    if (collection.created_by !== user.id) {
      throw new UnauthorizedError(
        'Bad Request: collection does not belong to user'
      )
    }

    return collection
  }

  async updateCollection(
    fingerprint: string,
    input: Partial<CollectionUpdate>
  ): Promise<Collection> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    const user = await authenticationService.getUser()
    const collection = await this.getCollection(fingerprint)

    if (collection.created_by !== user.id) {
      throw new UnauthorizedError(
        'Cannot update collection. Reason: unauthorized.'
      )
    }

    const newData: CollectionUpdate = {
      title: input.title ?? collection.title,
      description: input.description ?? collection.description,
      published: input.published ?? collection.published,
    }

    const updatedCollection =
      await this._collectionsRepository.updateCollection(fingerprint, newData)

    return updatedCollection
  }

  async deleteCollection(fingerprint: string): Promise<Collection> {
    const authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
    const user = await authenticationService.getUser()
    const collection = await this.getCollection(fingerprint)

    if (collection.created_by !== user.id) {
      throw new UnauthorizedError(
        'Cannot delete collection. Reason: unauthorized.'
      )
    }

    const deletedCollection =
      await this._collectionsRepository.deleteCollection(collection.fingerprint)

    return deletedCollection
  }
}
