import { CollectionDTO } from '@/dtos/collection'
import { UserDTO } from '@/dtos/users'

export interface ICollectionsRepository {
  createCollection(
    collection: CollectionDTO,
    user: UserDTO
  ): Promise<CollectionDTO>
}
