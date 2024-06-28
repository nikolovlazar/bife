import { ICollectionsRepository } from '@/repositories'
import { CollectionDTO } from '@/shared/dtos/collection'
import { UserDTO } from '@/shared/dtos/users'

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
