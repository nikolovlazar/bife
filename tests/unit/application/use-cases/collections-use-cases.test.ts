import { nanoid } from 'nanoid'
import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { deleteCollectionUseCase } from '@/application/use-cases/collections/delete-collection.use-case'
import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { updateCollectionUseCase } from '@/application/use-cases/collections/update-collection.use-case'

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
    expect(collection.created_by).toBe('1')
    expect(collection.fingerprint).not.toBe('test-fingerprint')
  })

  it('should throw when creating a collection with invalid input', async () => {
    // @ts-ignore
    expect(createCollectionUseCase({})).rejects.toThrow('Required')
  })

  it('should throw when a fingerprint collision happens', async () => {
    vi.mocked(nanoid).mockReturnValue('test-fingerprint')

    const firstCollection = await createCollectionUseCase({
      title: 'First Collection',
    })
    expect(firstCollection.fingerprint).toBe('test-fingerprint')

    expect(
      createCollectionUseCase({ title: 'Second Collection' })
    ).rejects.toThrowError('duplicate key value violates unique constraint')
  })
})

describe('Get Collection', () => {
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

  it('should return the collection with a valid fingerprint', async () => {
    const title = 'hello there'
    const { fingerprint } = await createCollectionUseCase({
      title,
    })

    const collection = await getCollectionUseCase(fingerprint)
    expect(collection.title).toBe(title)
  })

  it('should throw when requesting a collection with invalid fingerprint', async () => {
    expect(getCollectionUseCase('non-existing-fingerprint')).rejects.toThrow(
      'Cannot find a collection with that fingerprint'
    )
  })
})

describe('Update Collection', () => {
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

  it('should update the collection with valid input', async () => {
    const title = 'hello there'
    const description = 'how are you'

    const collection = await createCollectionUseCase({
      title,
    })

    const updatedCollection = await updateCollectionUseCase(collection, {
      description,
    })

    expect(updatedCollection.title).toBe(title)
    expect(updatedCollection.description).toBe(description)
    expect(updatedCollection.created_by).toBe('1')
  })

  it('should throw when updating a collection with invalid data', async () => {
    const title = 'hello there'
    const description = 'how are you'

    const collection = await createCollectionUseCase({
      title,
      description,
    })

    expect(updateCollectionUseCase(collection, { title: '' })).rejects.toThrow(
      'String must contain at least 1 character(s)'
    )
  })

  it("should throw when updating someone else's collection", async () => {
    const collection = await createCollectionUseCase({
      title: 'hello there',
      description: 'how are you',
    })

    expect(collection.created_by).toBe('1')

    const authenticationService = getInjection('IAuthenticationService')
    await authenticationService.signInWithPassword(
      'two@bife.sh',
      'twopassword',
      ''
    )

    expect(
      updateCollectionUseCase(collection, {
        title: 'hi',
        description: "i'm fine i guess",
      })
    ).rejects.toThrow('unauthorized')
  })
})

describe('Delete Collection', () => {
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

  it('should delete the collection with valid fingerprint', async () => {
    const collection = await createCollectionUseCase({
      title: 'hello there',
    })

    expect(deleteCollectionUseCase(collection)).resolves.toBeTruthy()
  })

  it("should throw when deleting someone else's collection", async () => {
    const collection = await createCollectionUseCase({
      title: 'hello there',
      description: 'how are you',
    })

    expect(collection.created_by).toBe('1')

    const authenticationService = getInjection('IAuthenticationService')
    await authenticationService.signInWithPassword(
      'two@bife.sh',
      'twopassword',
      ''
    )

    expect(() => deleteCollectionUseCase(collection)).rejects.toThrow(
      'unauthorized'
    )
  })
})