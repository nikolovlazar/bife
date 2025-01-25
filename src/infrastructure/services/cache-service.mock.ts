import { injectable } from 'inversify'

import { ICacheService } from '@/application/services/cache-service.interface'

@injectable()
export class MockCacheService implements ICacheService {
  private _redis: Record<string, string>

  constructor() {
    this._redis = {}
  }

  deleteCachedValue(key: string) {
    delete this._redis[key]
    return Promise.resolve()
  }

  getCachedValue(key: string) {
    const cached = this._redis[key]

    if (!cached) {
      return Promise.resolve(undefined)
    }

    const value = JSON.parse(cached)

    if (value.collection) {
      return Promise.resolve({ collection: value, link: undefined })
    } else {
      return Promise.resolve({ link: value, collection: undefined })
    }
  }

  setCachedLink(key: string, value: object) {
    this._redis[key] = JSON.stringify({ link: value, collection: undefined })
    return Promise.resolve()
  }

  setCachedCollection(key: string, value: object) {
    this._redis[key] = JSON.stringify({ collection: value, link: undefined })
    return Promise.resolve()
  }
}
