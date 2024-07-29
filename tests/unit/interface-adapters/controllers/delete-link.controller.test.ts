import 'reflect-metadata'
import { afterEach, beforeEach, expect, it } from 'vitest'

import { createLinkUseCase } from '@/application/use-cases/links/create-link.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError, NotFoundError } from '@/entities/errors/common'

import { deleteLinkController } from '@/interface-adapters/controllers/delete-link.controller'
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

  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  const linksRepository = getInjection('ILinksRepository')

  await expect(
    linksRepository.getLink(link.fingerprint)
  ).resolves.toMatchObject({
    url: link.url,
    label: link.label,
    fingerprint: link.fingerprint,
    created_by: '1',
  })

  await expect(
    deleteLinkController({ fingerprint: link.fingerprint })
  ).resolves.toBeUndefined()

  await expect(
    linksRepository.getLink(link.fingerprint)
  ).rejects.toBeInstanceOf(NotFoundError)
})

it('should throw InputParseError on invalid input', () => {
  // @ts-ignore
  expect(deleteLinkController({})).rejects.toBeInstanceOf(InputParseError)
})

it('should throw UnauthenticatedError when unauthenticated', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await authenticationService.signOut()

  await expect(
    deleteLinkController({ fingerprint: link.fingerprint })
  ).rejects.toBeInstanceOf(UnauthenticatedError)
})

it('should throw UnauthorizedError when unauthorized', async () => {
  const authenticationService = getInjection('IAuthenticationService')
  await authenticationService.signInWithPassword(
    'one@bife.sh',
    'onepassword',
    ''
  )

  const link = await createLinkUseCase({ url: 'bife.sh', label: 'bife.sh' })

  await authenticationService.signOut()

  await authenticationService.signInWithPassword(
    'two@bife.sh',
    'twopassword',
    ''
  )

  await expect(
    deleteLinkController({ fingerprint: link.fingerprint })
  ).rejects.toBeInstanceOf(UnauthorizedError)
})
