import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { UnauthenticatedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { createCollectionController } from '@/interface-adapters/controllers/create-collection.controller'
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

it('should throw InputParseError on invalid input', () => {
  expect(createCollectionController({})).rejects.toBeInstanceOf(InputParseError)
})

it('should throw UnauthenticatedError when unauthenticated', () => {
  const title = 'Hey stream!'
  const description = 'Controllers are cool'
  const input = { title, description }

  expect(createCollectionController(input)).rejects.toBeInstanceOf(
    UnauthenticatedError
  )
})

it('should pass with valid input', async () => {
  const title = 'Hey stream!'
  const description = 'Controllers are cool'
  const input = { title, description }

  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  expect(createCollectionController(input)).resolves.toHaveProperty(
    'fingerprint'
  )
})
