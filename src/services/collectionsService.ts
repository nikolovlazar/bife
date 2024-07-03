import { CollectionInsert, CollectionUpdate } from '@/utils/types'

import { ServiceLocator } from './serviceLocator'
import { ICollectionsRepository } from '@/repositories'
import { CollectionDTO } from '@/shared/dtos/collection'
import { UnauthorizedError } from '@/shared/errors/authErrors'

export class CollectionsService {
  constructor(private _collectionsRepository: ICollectionsRepository) {}

  async createCollection(collection: CollectionInsert): Promise<CollectionDTO> {
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

  async getPublicCollection(fingerprint: string): Promise<CollectionDTO> {
    const collection =
      await this._collectionsRepository.getCollection(fingerprint)
    return collection
  }

  async getCollection(fingerprint: string): Promise<CollectionDTO> {
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
  ): Promise<CollectionDTO> {
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

  async deleteCollection(fingerprint: string): Promise<CollectionDTO> {
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
