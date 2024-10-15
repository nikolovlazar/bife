import 'reflect-metadata'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { InputParseError } from '@/entities/errors/common'

import { forgotPasswordController } from '@/interface-adapters/controllers/forgot-password.controller'
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
  const forgotPasswordSpy = vi.spyOn(authenticationService, 'forgotPassword')

  await expect(
    forgotPasswordController({
      email: 'test@example.com',
      tsToken: 'validToken',
    })
  ).resolves.toBeUndefined()

  expect(forgotPasswordSpy).toHaveBeenCalledWith(
    'test@example.com',
    'validToken'
  )
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(forgotPasswordController()).rejects.toBeInstanceOf(
    InputParseError
  )

  // @ts-ignore
  await expect(forgotPasswordController({})).rejects.toBeInstanceOf(
    InputParseError
  )

  await expect(
    // @ts-ignore
    forgotPasswordController({ email: 'test@example.com' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    forgotPasswordController({ tsToken: 'validToken' })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    forgotPasswordController({
      email: 'invalid-email',
      tsToken: 'validToken',
    })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should pass even if email does not exist', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  const forgotPasswordSpy = vi.spyOn(authenticationService, 'forgotPassword')

  await expect(
    forgotPasswordController({
      email: 'nonexistent@example.com',
      tsToken: 'validToken',
    })
  ).resolves.toBeUndefined()

  expect(forgotPasswordSpy).toHaveBeenCalledWith(
    'nonexistent@example.com',
    'validToken'
  )
})
