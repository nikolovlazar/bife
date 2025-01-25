import { getInjection } from '~/di/container'

export async function getByFingerprintCached(fingerprint: string) {
  const cacheService = getInjection('ICacheService')
  const value = await cacheService.getCachedValue(fingerprint)

  return value
}
