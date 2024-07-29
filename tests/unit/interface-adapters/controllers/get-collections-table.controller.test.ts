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

  expect(getCollectionsTableController()).resolves.toMatchObject([
    { title: 'one', created_at },
    { title: 'two', created_at },
    { title: 'three', created_at },
  ])
})

it('should throw UnauthenticatedError when not logged in', () => {
  expect(getCollectionsTableController()).rejects.toBeInstanceOf(
    UnauthenticatedError
  )
})
