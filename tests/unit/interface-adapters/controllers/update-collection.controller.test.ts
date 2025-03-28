import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { updateCollectionController } from '@/interface-adapters/controllers/update-collection.controller'
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
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )
  const collection = await createCollectionUseCase({ title: 'collectin' })

  await expect(
    updateCollectionController({
      fingerprint: collection.fingerprint,
      title: 'collection',
      published: !collection.published,
    })
  ).resolves.toBeUndefined()
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(updateCollectionController({})).rejects.toBeInstanceOf(
    InputParseError
  )
})

it('should throw UnauthenticatedError when unauthenticated', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )
  const collection = await createCollectionUseCase({ title: 'collectin' })
  await authenticationService.signOut()

  await expect(
    updateCollectionController({
      fingerprint: collection.fingerprint,
      title: 'collection',
      published: !collection.published,
    })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when updating not-owned', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )
  const collection = await createCollectionUseCase({ title: 'collectin' })
  await authenticationService.signOut()
  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  await expect(
    updateCollectionController({
      fingerprint: collection.fingerprint,
      title: 'collection',
      published: !collection.published,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
