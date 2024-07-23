import dayjs from 'dayjs'
import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError } from '@/entities/errors/auth'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'
import { getOwnLinksController } from '@/interface-adapters/controllers/get-own-links.controller'

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

  expect(getOwnLinksController()).resolves.toMatchObject([
    { label: 'One', url: 'one@bife.sh', created_at },
    { label: 'Two', url: 'two@bife.sh', created_at },
    { label: 'Three', url: 'three@bife.sh', created_at },
  ])
})

it('should throw UnauthenticatedError when not logged in', () => {
  expect(getOwnLinksController()).rejects.toBeInstanceOf(UnauthenticatedError)
})
