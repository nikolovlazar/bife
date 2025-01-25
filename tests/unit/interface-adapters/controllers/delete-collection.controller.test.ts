import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { deleteCollectionController } from '@/interface-adapters/controllers/delete-collection.controller'
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

it('should pass for valid input', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collection = await createCollectionUseCase({ title: 'collection' })

  await expect(
    deleteCollectionController({ fingerprint: collection.fingerprint })
  ).resolves.toBeUndefined()
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(deleteCollectionController({})).rejects.toBeInstanceOf(
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

  const collection = await createCollectionUseCase({ title: 'collection' })
  await authenticationService.signOut()

  await expect(
    deleteCollectionController({ fingerprint: collection.fingerprint })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when deleting not-owned', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collection = await createCollectionUseCase({ title: 'collection' })

  await authenticationService.signOut()
  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  await expect(
    deleteCollectionController({ fingerprint: collection.fingerprint })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
