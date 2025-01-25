import dayjs from 'dayjs'
import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError } from '@/entities/errors/auth'

import { getOwnLinksController } from '@/interface-adapters/controllers/get-own-links.controller'
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
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const created_at = dayjs(new Date()).format('MMM D, YYYY')

  await createLinkUseCase({ label: 'One', url: 'one@bife.sh' })
  await createLinkUseCase({ label: 'Two', url: 'two@bife.sh' })
  await createLinkUseCase({ label: 'Three', url: 'three@bife.sh' })

  await expect(getOwnLinksController()).resolves.toMatchObject({
    data: [
      { label: 'One', url: 'one@bife.sh', created_at },
      { label: 'Two', url: 'two@bife.sh', created_at },
      { label: 'Three', url: 'three@bife.sh', created_at },
    ],
    totalCount: 3,
  })
})

it('should throw UnauthenticatedError when not logged in', async () => {
  await expect(getOwnLinksController()).rejects.toBeInstanceOf(
    UnauthenticatedError
  )
})

it('should return paginated links when logged in', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  // Create 15 links
  for (let i = 1; i <= 15; i++) {
    await createLinkUseCase({
      url: `https://example${i}.com`,
      label: `Link ${i}`,
    })
  }

  // Test first page
  const firstPage = await getOwnLinksController(1, 10)
  expect(firstPage.data).toHaveLength(10)
  expect(firstPage.totalCount).toBe(15)
  expect(firstPage.data[0].label).toBe('Link 1')
  expect(firstPage.data[9].label).toBe('Link 10')

  // Test second page
  const secondPage = await getOwnLinksController(2, 10)
  expect(secondPage.data).toHaveLength(5)
  expect(secondPage.totalCount).toBe(15)
  expect(secondPage.data[0].label).toBe('Link 11')
  expect(secondPage.data[4].label).toBe('Link 15')

  // Test with different page size
  const customPageSize = await getOwnLinksController(1, 5)
  expect(customPageSize.data).toHaveLength(5)
  expect(customPageSize.totalCount).toBe(15)
  expect(customPageSize.data[0].label).toBe('Link 1')
  expect(customPageSize.data[4].label).toBe('Link 5')

  const result = await getOwnLinksController(1, 10)
  expect(result).toMatchObject({
    data: [
      { label: 'Link 1', url: 'https://example1.com' },
      { label: 'Link 2', url: 'https://example2.com' },
      { label: 'Link 3', url: 'https://example3.com' },
      { label: 'Link 4', url: 'https://example4.com' },
      { label: 'Link 5', url: 'https://example5.com' },
      { label: 'Link 6', url: 'https://example6.com' },
      { label: 'Link 7', url: 'https://example7.com' },
      { label: 'Link 8', url: 'https://example8.com' },
      { label: 'Link 9', url: 'https://example9.com' },
      { label: 'Link 10', url: 'https://example10.com' },
    ],
    totalCount: 15,
  })
})

it('should throw UnauthenticatedError when not logged in', async () => {
  await expect(getOwnLinksController(1, 10)).rejects.toBeInstanceOf(
    UnauthenticatedError
  )
})
