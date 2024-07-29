import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { addLinkToCollectionController } from '@/interface-adapters/controllers/add-link-to-collection.controller'
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
  const link = await createLinkUseCase({
    url: 'https://bife.sh',
    label: 'Bife.sh',
  })

  expect(
    addLinkToCollectionController({
      fingerprint: collection.fingerprint,
      linkFingerprint: link.fingerprint,
    })
  ).resolves.toBeUndefined()
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  expect(addLinkToCollectionController({})).rejects.toBeInstanceOf(
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
  const link = await createLinkUseCase({
    url: 'https://bife.sh',
    label: 'Bife.sh',
  })

  await authenticationService.signOut()

  expect(
    addLinkToCollectionController({
      fingerprint: collection.fingerprint,
      linkFingerprint: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when adding not owned links to not owned collections (incl permutations)', async () => {
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

  const link = await createLinkUseCase({
    url: 'https://bife.sh',
    label: 'Bife.sh',
  })

  // Link -> not owned Collection
  expect(
    addLinkToCollectionController({
      fingerprint: collection.fingerprint,
      linkFingerprint: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)

  await authenticationService.signOut()
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  // not owned Link -> Collection
  expect(
    addLinkToCollectionController({
      fingerprint: collection.fingerprint,
      linkFingerprint: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)

  await authenticationService.signOut()
  await authenticationService.signInWithPassword(
    'three@bife.sh',
    'threepassword',
    ''
  )

  // not owned Link -> not owned Collection
  expect(
    addLinkToCollectionController({
      fingerprint: collection.fingerprint,
      linkFingerprint: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
