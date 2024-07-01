import { CollectionInsert, CollectionUpdate } from '@/utils/types'

import { AuthenticationService } from './authenticationService'
import { ServiceLocator } from './serviceLocator'
import { ICollectionsRepository } from '@/repositories'
import { CollectionDTO } from '@/shared/dtos/collection'

export class CollectionsService {
  private _collectionsRepository: ICollectionsRepository
  private _authenticationService: AuthenticationService

  constructor(collectionsRepository: ICollectionsRepository) {
    this._collectionsRepository = collectionsRepository
    this._authenticationService = ServiceLocator.getService(
      'AuthenticationService'
    )
  }

  async createCollection(collection: CollectionInsert): Promise<CollectionDTO> {
    const user = await this._authenticationService.getUser()

    const newCollection = await this._collectionsRepository.createCollection(
      collection,
      user.id
    )

    return newCollection
  }

  async getCollectionForUser(fingerprint: string): Promise<CollectionDTO> {
    const user = await this._authenticationService.getUser()

    const collection =
      await this._collectionsRepository.getCollection(fingerprint)

    if (collection.created_by !== user.id) {
      throw new Error('Bad Request: collection does not belong to user')
    }

    return collection
  }

  async updateCollection(
    fingerprint: string,
    input: Partial<CollectionUpdate>
  ): Promise<CollectionDTO> {
    const collection = await this.getCollectionForUser(fingerprint)

    const newData: CollectionUpdate = {
      title: input.title ?? collection.title,
      description: input.description ?? collection.description,
      published: input.published ?? collection.published,
    }

    const updatedCollection =
      await this._collectionsRepository.updateCollection(fingerprint, newData)

    return updatedCollection
  }

  async deleteCollection(fingerprint: string): Promise<CollectionDTO> {
    const collection = await this.getCollectionForUser(fingerprint)

    const deletedCollection =
      await this._collectionsRepository.deleteCollection(collection.fingerprint)

    return deletedCollection
  }
}
