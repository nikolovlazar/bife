import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import {
  AuthenticationError,
  UnauthenticatedError,
  UnauthorizedError,
} from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'
import { signInWithPasswordController } from '@/interface-adapters/controllers/sign-in-with-password.controller'

beforeEach(async () => {
  initializeContainer()
})

afterEach(() => {
  destroyContainer()
})

it('should pass with valid input', async () => {
  await expect(
    signInWithPasswordController({
      email: 'one@bife.sh',
      password: 'onepassword',
      tsToken: '',
    })
  ).resolves.toBeUndefined()

  const authenticationService = getInjection('IAuthenticationService')
  await expect(authenticationService.getUser()).resolves.toMatchObject({
    id: '1',
    email: 'one@bife.sh',
  })

  await authenticationService.signOut()

  await expect(
    signInWithPasswordController({
      email: 'two@bife.sh',
      password: 'twopassword',
      tsToken: '',
    })
  ).resolves.toBeUndefined()

  await expect(authenticationService.getUser()).resolves.toMatchObject({
    id: '2',
    email: 'two@bife.sh',
  })
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(signInWithPasswordController()).rejects.toBeInstanceOf(
    InputParseError
  )

  // @ts-ignore
  await expect(signInWithPasswordController({})).rejects.toBeInstanceOf(
    InputParseError
  )

  await expect(
    // @ts-ignore
    signInWithPasswordController({ email: 'one@bife.sh' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    signInWithPasswordController({ password: 'onepassword' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    signInWithPasswordController({
      email: 'one@bife.sh',
      password: 'onepassword',
    })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should throw AuthenticationError on wrong credentials', async () => {
  // Good email, wrong password
  await expect(
    signInWithPasswordController({
      email: 'one@bife.sh',
      password: 'onepswd',
      tsToken: '',
    })
  ).rejects.toBeInstanceOf(AuthenticationError)

  // Wrong email, wrong password
  await expect(
    signInWithPasswordController({
      email: 'one@bifeeeeeeeeeeee.sh',
      password: 'onepswd',
      tsToken: '',
    })
  ).rejects.toBeInstanceOf(AuthenticationError)

  // Wrong email, good password
  await expect(
    signInWithPasswordController({
      email: 'one@bifeeeeeeeeeeee.sh',
      password: 'onepassword',
      tsToken: '',
    })
  ).rejects.toBeInstanceOf(AuthenticationError)
})
