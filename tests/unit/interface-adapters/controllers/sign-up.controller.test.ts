import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { AuthenticationError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { signUpController } from '@/interface-adapters/controllers/sign-up.controller'
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

it('should pass with valid input', async () => {
  await expect(
    signUpController({
      email: 'new@example.com',
      password: 'newpassword',
      confirmPassword: 'newpassword',
      tsToken: '',
    })
  ).resolves.toBeUndefined()

  const authenticationService = getInjection('IAuthenticationService')
  await expect(authenticationService.getUser()).resolves.toMatchObject({
    email: 'new@example.com',
  })
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(signUpController()).rejects.toBeInstanceOf(InputParseError)

  // @ts-ignore
  await expect(signUpController({})).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    signUpController({ email: 'new@example.com' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    signUpController({ password: 'newpassword' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    signUpController({
      email: 'new@example.com',
      password: 'newpassword',
    })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    signUpController({
      email: 'new@example.com',
      password: 'newpassword',
      confirmPassword: 'differentpassword',
      tsToken: '',
    })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should throw AuthenticationError on existing email', async () => {
  const authenticationService = getInjection('IAuthenticationService')

  // Create the existing user first
  await authenticationService.signUp('existing@example.com', 'password', '')

  // Attempt to sign up with the same email
  await expect(
    signUpController({
      email: 'existing@example.com',
      password: 'newpassword',
      confirmPassword: 'newpassword',
      tsToken: '',
    })
  ).rejects.toBeInstanceOf(AuthenticationError)
})
