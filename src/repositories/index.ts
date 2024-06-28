import { CollectionDTO } from '@/shared/dtos/collection'
import { UserDTO } from '@/shared/dtos/users'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionDTO,
    user: UserDTO
  ): Promise<CollectionDTO>
}
