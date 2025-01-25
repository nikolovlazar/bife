import { Redis } from '@upstash/redis'
import { injectable } from 'inversify'

import {
  type CacheReturn,
  ICacheService,
} from '@/application/services/cache-service.interface'

@injectable()
export class CacheService implements ICacheService {
  private _redis: Redis
  private _expiry = 7 * 24 * 60 * 60

  constructor() {
    this._redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }

  async deleteCachedValue(key: string) {
    await this._redis.del(key)
  }

  async getCachedValue(key: string) {
    const cached = await this._redis.get<CacheReturn>(key)

    if (!cached) {
      return undefined
    }

    return cached
  }

  async setCachedLink(key: string, value: object) {
    await this._redis.set(
      key,
      JSON.stringify({ link: value, collection: undefined }),
      {
        ex: this._expiry,
      }
    )
  }

  async setCachedCollection(key: string, value: object) {
    await this._redis.set(
      key,
      JSON.stringify({ collection: value, link: undefined }),
      {
        ex: this._expiry,
      }
    )
  }
}
