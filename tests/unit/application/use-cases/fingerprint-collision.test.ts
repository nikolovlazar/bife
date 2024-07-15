import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'

vi.mock('nanoid', () => ({
  nanoid: vi.fn().mockReturnValue('test-fingerprint'),
}))

/*
 * This test case must be isolated into its own file due to having to mock the nanoid package
 */
describe('Fingerprint collision', () => {
  beforeEach(() => {
    initializeContainer()
  })

  afterEach(() => {
    destroyContainer()
  })

  it('should throw when a fingerprint collision happens', async () => {
    const collectionsUseCases = getInjection('CollectionsUseCases')

    const firstCollection = await collectionsUseCases.createCollection({
      title: 'First Collection',
    })
    expect(firstCollection.fingerprint).toBe('test-fingerprint')

    expect(() =>
      collectionsUseCases.createCollection({ title: 'Second Collection' })
    ).rejects.toThrowError('duplicate key value violates unique constraint')
  })
})
