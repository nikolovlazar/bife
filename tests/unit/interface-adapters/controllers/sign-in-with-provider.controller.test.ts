import 'reflect-metadata'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { InputParseError } from '@/entities/errors/common'

import { signInWithProviderController } from '@/interface-adapters/controllers/sign-in-with-provider.controller'
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
  const mockUrl = 'https://example.com/auth'
  const authenticationService = getInjection('IAuthenticationService')
  vi.spyOn(authenticationService, 'signInWithProvider').mockResolvedValue({
    url: mockUrl,
  })

  await expect(
    signInWithProviderController({
      provider: 'google',
    })
  ).resolves.toEqual({ url: mockUrl })

  expect(authenticationService.signInWithProvider).toHaveBeenCalledWith(
    'google'
  )

  vi.spyOn(authenticationService, 'signInWithProvider').mockResolvedValue({
    url: mockUrl,
  })

  await expect(
    signInWithProviderController({
      provider: 'github',
    })
  ).resolves.toEqual({ url: mockUrl })

  expect(authenticationService.signInWithProvider).toHaveBeenCalledWith(
    'github'
  )
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(signInWithProviderController()).rejects.toBeInstanceOf(
    InputParseError
  )

  // @ts-ignore
  await expect(signInWithProviderController({})).rejects.toBeInstanceOf(
    InputParseError
  )

  await expect(
    // @ts-ignore
    signInWithProviderController({ provider: 'invalid_provider' })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should throw error when authentication service fails', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  vi.spyOn(authenticationService, 'signInWithProvider').mockRejectedValue(
    new Error('Authentication failed')
  )

  await expect(
    signInWithProviderController({
      provider: 'google',
    })
  ).rejects.toThrow('Authentication failed')
})
