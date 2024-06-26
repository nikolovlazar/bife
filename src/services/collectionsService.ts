import { CollectionDTO } from '@/dtos/collection'
import { UserDTO } from '@/dtos/users'
import { ICollectionsRepository } from '@/repositories'

export class CollectionsService {
  private _collectionsRepository: ICollectionsRepository

  constructor(collectionsRepository: ICollectionsRepository) {
    this._collectionsRepository = collectionsRepository
  }

  async createCollection(collection: CollectionDTO, user: UserDTO) {
    const newCollection = await this._collectionsRepository.createCollection(
      collection,
      user
    )

    return newCollection
  }
}
