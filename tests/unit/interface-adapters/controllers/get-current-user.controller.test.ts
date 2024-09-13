import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { UnauthenticatedError } from '@/entities/errors/auth'

import { getUserController } from '@/interface-adapters/controllers/get-user.controller'
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

it('should return current user', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  await expect(getUserController()).resolves.toMatchObject({
    id: '1',
    email: 'one@bife.sh',
  })

  await authenticationService.signOut()

  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  await expect(getUserController()).resolves.toMatchObject({
    id: '2',
    email: 'two@bife.sh',
  })
})

it('should throw AuthenticationError on unauthenticated', async () => {
  await expect(getUserController()).rejects.toBeInstanceOf(UnauthenticatedError)
})
