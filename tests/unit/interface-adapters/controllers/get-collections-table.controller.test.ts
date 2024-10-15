import dayjs from 'dayjs'
import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { UnauthenticatedError } from '@/entities/errors/auth'

import { createCollectionController } from '@/interface-adapters/controllers/create-collection.controller'
import { getCollectionsTableController } from '@/interface-adapters/controllers/get-collections-table.controller'
import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '~/di/container'

beforeEach(async () => {
  initializeContainer()
})

afterEach(() => {
  destroyContainer()
})

it('should pass when logged in', async () => {
  const created_at = dayjs(new Date()).format('MMM D, YYYY')
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  await createCollectionController({ title: 'one' })
  await createCollectionController({ title: 'two' })
  await createCollectionController({ title: 'three' })

  expect(getCollectionsTableController()).resolves.toMatchObject({
    data: [
      { title: 'one', created_at },
      { title: 'two', created_at },
      { title: 'three', created_at },
    ],
    totalCount: 3,
  })
})

it('should return paginated collections when logged in', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  // Create 15 collections
  for (let i = 1; i <= 15; i++) {
    await createCollectionController({ title: `Collection ${i}` })
  }

  // Test first page
  const firstPage = await getCollectionsTableController(1, 10)
  expect(firstPage.data).toHaveLength(10)
  expect(firstPage.totalCount).toBe(15)
  expect(firstPage.data[0].title).toBe('Collection 1')
  expect(firstPage.data[9].title).toBe('Collection 10')

  // Test second page
  const secondPage = await getCollectionsTableController(2, 10)
  expect(secondPage.data).toHaveLength(5)
  expect(secondPage.totalCount).toBe(15)
  expect(secondPage.data[0].title).toBe('Collection 11')
  expect(secondPage.data[4].title).toBe('Collection 15')

  // Test with different page size
  const customPageSize = await getCollectionsTableController(1, 5)
  expect(customPageSize.data).toHaveLength(5)
  expect(customPageSize.totalCount).toBe(15)
  expect(customPageSize.data[0].title).toBe('Collection 1')
  expect(customPageSize.data[4].title).toBe('Collection 5')
})

it('should throw UnauthenticatedError when not logged in', () => {
  expect(getCollectionsTableController(1, 10)).rejects.toBeInstanceOf(
    UnauthenticatedError
  )
})
