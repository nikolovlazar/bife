import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createCollectionUseCase } from '@/application/use-cases/collections/create-collection.use-case'
import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'
import { getLinksForCollectionUseCase } from '@/application/use-cases/links/get-links-for-collection.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError } from '@/entities/errors/common'

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from '@/di/container'
import { addLinkToCollectionController } from '@/interface-adapters/controllers/add-link-to-collection.controller'
import { updateLinksOrderController } from '@/interface-adapters/controllers/update-links-order.controller'

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
  const linkOne = await createLinkUseCase({
    url: 'one.com',
    label: '',
  })
  const linkTwo = await createLinkUseCase({
    url: 'two.com',
    label: '',
  })
  const linkThree = await createLinkUseCase({
    url: 'three.com',
    label: '',
  })

  await addLinkToCollectionController({
    fingerprint: collection.fingerprint,
    linkFingerprint: linkOne.fingerprint,
  })
  await addLinkToCollectionController({
    fingerprint: collection.fingerprint,
    linkFingerprint: linkTwo.fingerprint,
  })
  await addLinkToCollectionController({
    fingerprint: collection.fingerprint,
    linkFingerprint: linkThree.fingerprint,
  })

  // Assert initial state
  await expect(getLinksForCollectionUseCase(collection)).resolves.toMatchObject(
    [
      {
        order: 1,
        link: { fingerprint: linkOne.fingerprint, url: linkOne.url },
      },
      {
        order: 2,
        link: { fingerprint: linkTwo.fingerprint, url: linkTwo.url },
      },
      {
        order: 3,
        link: { fingerprint: linkThree.fingerprint, url: linkThree.url },
      },
    ]
  )

  // Update -> 3, 1, 2
  await expect(
    updateLinksOrderController({
      fingerprint: collection.fingerprint,
      linksOrder: [
        { fingerprint: linkThree.fingerprint, order: 1 },
        { fingerprint: linkOne.fingerprint, order: 2 },
        { fingerprint: linkTwo.fingerprint, order: 3 },
      ],
    })
  ).resolves.toBeUndefined()

  // Assert -> 3, 1, 2
  await expect(getLinksForCollectionUseCase(collection)).resolves.toMatchObject(
    [
      {
        order: 1,
        link: { fingerprint: linkThree.fingerprint, url: linkThree.url },
      },
      {
        order: 2,
        link: { fingerprint: linkOne.fingerprint, url: linkOne.url },
      },
      {
        order: 3,
        link: { fingerprint: linkTwo.fingerprint, url: linkTwo.url },
      },
    ]
  )
})
