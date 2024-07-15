import 'reflect-metadata'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'

describe('collections-use-cases', () => {
  beforeEach(() => {
    initializeContainer()
  })

  afterEach(() => {
    destroyContainer()
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
