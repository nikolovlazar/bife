import { nanoid } from 'nanoid'
import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'

vi.mock('nanoid', () => ({
  nanoid: vi.fn(),
}))

describe('Create Collections', () => {
  beforeEach(async () => {
    const actualNanoid =
      await vi.importActual<typeof import('nanoid')>('nanoid')

    vi.mocked(nanoid).mockImplementation((size?: number) =>
      actualNanoid.nanoid(size)
    )

    initializeContainer()
  })

  afterEach(() => {
    destroyContainer()
    vi.restoreAllMocks()
  })

  it('should create a collection with valid input', async () => {
    const collectionsUseCases = getInjection('CollectionsUseCases')
    const title = 'Next.js + Clean Architecture'
    const description = 'Clean Architecture is super fun'

    const collection = await collectionsUseCases.createCollection({
      title,
      description,
    })

    expect(collection.title).toBe(title)
    expect(collection.description).toBe(description)
    expect(collection.fingerprint).not.toBe('test-fingerprint')
  })

  it('should throw when creating a collection with invalid input', async () => {
    const collectionsUseCases = getInjection('CollectionsUseCases')

    // @ts-ignore
    expect(() => collectionsUseCases.createCollection({})).rejects.toThrow(
      'Required'
    )
  })

  it('should throw when a fingerprint collision happens', async () => {
    vi.mocked(nanoid).mockReturnValue('test-fingerprint')
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

describe('Get Collection', () => {
  beforeEach(async () => {
    const actualNanoid =
      await vi.importActual<typeof import('nanoid')>('nanoid')

    vi.mocked(nanoid).mockImplementation(() => actualNanoid.nanoid())
    initializeContainer()
  })

  afterEach(() => {
    destroyContainer()
    vi.restoreAllMocks()
  })

  it('should return the collection with a valid fingerprint', async () => {
    const collectionsUseCases = getInjection('CollectionsUseCases')

    const { fingerprint } = await collectionsUseCases.createCollection({
      title: 'hello there',
    })

    const collection = await collectionsUseCases.getCollection(fingerprint)
    expect(collection.title).toBe('hello there')
  })
})
