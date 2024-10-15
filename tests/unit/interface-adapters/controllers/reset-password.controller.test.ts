import 'reflect-metadata'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { AuthenticationError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { resetPasswordController } from '@/interface-adapters/controllers/reset-password.controller'
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
  const authenticationService = getInjection('IAuthenticationService')
  const resetPasswordSpy = vi.spyOn(authenticationService, 'resetPassword')

  await expect(
    resetPasswordController({
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    })
  ).resolves.toBeUndefined()

  expect(resetPasswordSpy).toHaveBeenCalledWith('newPassword123')
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(resetPasswordController()).rejects.toBeInstanceOf(
    InputParseError
  )

  // @ts-ignore
  await expect(resetPasswordController({})).rejects.toBeInstanceOf(
    InputParseError
  )

  await expect(
    resetPasswordController({
      password: 'short',
      confirmPassword: 'short',
    })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    resetPasswordController({
      password: 'validPassword123',
      confirmPassword: 'differentPassword123',
    })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should throw AuthenticationError when not authenticated', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  vi.spyOn(authenticationService, 'resetPassword').mockRejectedValue(
    new AuthenticationError('User not authenticated')
  )

  await expect(
    resetPasswordController({
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    })
  ).rejects.toBeInstanceOf(AuthenticationError)
})
