import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

export type CacheReturn =
  | { collection: Collection; link: undefined }
  | { collection: undefined; link: Link }
  | undefined

export interface ICacheService {
  getCachedValue(key: string): Promise<CacheReturn>
  setCachedLink(key: string, value: object): Promise<void>
  setCachedCollection(key: string, value: object): Promise<void>
  deleteCachedValue(key: string): Promise<void>
}
