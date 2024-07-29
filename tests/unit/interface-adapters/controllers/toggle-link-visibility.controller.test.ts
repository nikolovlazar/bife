import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { addLinkToCollectionUseCase } from '@/application/use-cases/links/add-link-to-collection.use-case'
import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import { toggleLinkVisibilityController } from '@/interface-adapters/controllers/toggle-link-visibility.controller'
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

  const collection = await createCollectionUseCase({ title: 'collection' })
  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await addLinkToCollectionUseCase(link, collection)

  const collectionLinkRepository = getInjection('ICollectionLinkRepository')

  const links = await collectionLinkRepository.getLinksForCollection(
    collection.fingerprint
  )
  expect(links).toHaveLength(1)
  expect(links).toMatchObject([{ visible: true, order: 1, link }])

  await expect(
    toggleLinkVisibilityController({
      collection_pk: collection.fingerprint,
      link_pk: link.fingerprint,
      checked: false,
    })
  ).resolves.toBeUndefined()

  const newLinks = await collectionLinkRepository.getLinksForCollection(
    collection.fingerprint
  )
  expect(newLinks).toHaveLength(1)
  expect(newLinks).toMatchObject([{ visible: false, order: 1, link }])
})

it('should throw InputParseError on invalid input', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collection = await createCollectionUseCase({ title: 'collection' })
  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await addLinkToCollectionUseCase(link, collection)

  // @ts-ignore
  await expect(toggleLinkVisibilityController({})).rejects.toBeInstanceOf(
    InputParseError
  )

  await expect(
    // @ts-ignore
    toggleLinkVisibilityController({
      collection_pk: collection.fingerprint,
      link_pk: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    toggleLinkVisibilityController({
      link_pk: link.fingerprint,
    })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    toggleLinkVisibilityController({
      collection_pk: collection.fingerprint,
    })
  ).rejects.toBeInstanceOf(InputParseError)

  await expect(
    // @ts-ignore
    toggleLinkVisibilityController({
      checked: false,
    })
  ).rejects.toBeInstanceOf(InputParseError)
})

it('should throw UnauthenticatedError when unauthenticated', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collection = await createCollectionUseCase({ title: 'collection' })
  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await addLinkToCollectionUseCase(link, collection)

  await authenticationService.signOut()

  await expect(
    toggleLinkVisibilityController({
      collection_pk: collection.fingerprint,
      link_pk: link.fingerprint,
      checked: false,
    })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when unauthorized', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const collectionOne = await createCollectionUseCase({ title: 'collection' })
  const linkOne = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await addLinkToCollectionUseCase(linkOne, collectionOne)

  await authenticationService.signOut()

  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  // Not own collection -> not own link
  await expect(
    toggleLinkVisibilityController({
      collection_pk: collectionOne.fingerprint,
      link_pk: linkOne.fingerprint,
      checked: false,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)

  const linkTwo = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  // Not own collection -> own link
  await expect(
    toggleLinkVisibilityController({
      collection_pk: collectionOne.fingerprint,
      link_pk: linkTwo.fingerprint,
      checked: false,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)

  await authenticationService.signOut()

  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  // Own collection -> not own link
  await expect(
    toggleLinkVisibilityController({
      collection_pk: collectionOne.fingerprint,
      link_pk: linkTwo.fingerprint,
      checked: false,
    })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
