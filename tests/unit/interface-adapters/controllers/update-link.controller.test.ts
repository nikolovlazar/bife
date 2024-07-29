import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { createLinkController } from '@/interface-adapters/controllers/create-link.controller'
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

  const label = 'Bife'
  const url = 'https://bife.sh'
  const input = { label, url }

  // Link without collection
  const linkOne = await createLinkController(input)
  expect(linkOne).toMatchObject({
    label,
    url,
  })

  const collection = await createCollectionUseCase({ title: 'Collection' })

  // Link with collection
  const linkTwo = await createLinkController({
    ...input,
    collectionFingerprint: collection.fingerprint,
  })
  expect(linkTwo).toMatchObject({
    label,
    url,
  })

  const linksForCollection = await getLinksForCollectionUseCase(collection)
  expect(linksForCollection).toMatchObject([
    {
      link: { fingerprint: linkTwo.fingerprint, label, url },
      order: 1,
    },
  ])
})

it('should throw InputParseError on invalid input', () => {
  // @ts-ignore
  expect(createLinkController({})).rejects.toBeInstanceOf(InputParseError)
})

it('should throw UnauthenticatedError when unauthenticated', () => {
  expect(
    createLinkController({ label: 'Bife.sh', url: 'https://bife.sh' })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when passing not-owned collection', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collection = await createCollectionUseCase({ title: 'Collection' })

  await authenticationService.signOut()
  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  expect(
    createLinkController({
      label: 'Bife.sh',
      url: 'https://bife.sh',
      collectionFingerprint: collection.fingerprint,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
