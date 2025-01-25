import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { addLinkToCollectionController } from '@/interface-adapters/controllers/add-link-to-collection.controller'
import { removeLinkFromCollectionController } from '@/interface-adapters/controllers/remove-link-from-collection.controller'
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

  await addLinkToCollectionController({
    linkFingerprint: link.fingerprint,
    fingerprint: collection.fingerprint,
  })

  await expect(
    removeLinkFromCollectionController({
      linkFingerprint: link.fingerprint,
      fingerprint: collection.fingerprint,
    })
  ).resolves.toBeUndefined()
})

it('should throw InputParseError on invalid input', async () => {
  // @ts-ignore
  await expect(removeLinkFromCollectionController({})).rejects.toBeInstanceOf(
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

  await addLinkToCollectionController({
    linkFingerprint: link.fingerprint,
    fingerprint: collection.fingerprint,
  })

  await authenticationService.signOut()

  await expect(
    removeLinkFromCollectionController({
      linkFingerprint: link.fingerprint,
      fingerprint: collection.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError error when removing not-owned', async () => {
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
  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  // not owned Link -> not owned Collection
  await expect(
    removeLinkFromCollectionController({
      linkFingerprint: link.fingerprint,
      fingerprint: collection.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
