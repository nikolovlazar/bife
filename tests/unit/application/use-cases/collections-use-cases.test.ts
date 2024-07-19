import { nanoid } from 'nanoid'
import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'

import { destroyContainer, initializeContainer } from '@/di/container'

vi.mock('nanoid', () => ({
  nanoid: vi.fn(),
}))

describe('Create Collections', () => {
  beforeEach(async () => {
    const actualNanoid =
      await vi.importActual<typeof import('nanoid')>('nanoid')

    vi.mocked(nanoid).mockImplementation((...args) =>
      actualNanoid.nanoid(...args)
    )

    initializeContainer()
  })

  afterEach(() => {
    destroyContainer()
    vi.restoreAllMocks()
  })

  it('should create a collection with valid input', async () => {
    const title = 'Next.js + Clean Architecture'
    const description = 'Clean Architecture is super fun'

    const collection = await createCollectionUseCase({
      title,
      description,
    })

    expect(collection.title).toBe(title)
    expect(collection.description).toBe(description)
    expect(collection.fingerprint).not.toBe('test-fingerprint')
  })

  it('should throw when creating a collection with invalid input', async () => {
    // @ts-ignore
    expect(() => createCollectionUseCase({})).rejects.toThrow('Required')
  })

  it('should throw when a fingerprint collision happens', async () => {
    vi.mocked(nanoid).mockReturnValue('test-fingerprint')

    const firstCollection = await createCollectionUseCase({
      title: 'First Collection',
    })
    expect(firstCollection.fingerprint).toBe('test-fingerprint')

    expect(() =>
      createCollectionUseCase({ title: 'Second Collection' })
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
    const { fingerprint } = await createCollectionUseCase({
      title: 'hello there',
    })

    const collection = await getCollectionUseCase(fingerprint)
    expect(collection.title).toBe('hello there')
  })
})
