'use server'

import { revalidatePath } from 'next/cache'
import { ZSAError } from 'zsa'

import { getCollectionUseCase } from '@/application/use-cases/collections/get-collection.use-case'
import { deleteLinkUseCase } from '@/application/use-cases/links/delete-link.use-case'
import { getLinkUseCase } from '@/application/use-cases/links/get-link.use-case'
import { updateLinkVisibilityUseCase } from '@/application/use-cases/links/update-link-visibility.use-case'
import { updateLinkUseCase } from '@/application/use-cases/links/update-link.use-case'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError, OperationError } from '@/entities/errors/common'
import { Collection } from '@/entities/models/collection'
import { Link } from '@/entities/models/link'

import { createLinkController } from '@/interface-adapters/controllers/create-link.controller'
import {
  CreateLinkInput,
  deleteLinkInputSchema,
  toggleLinkVisibilityInputSchema,
  updateLinkInputSchema,
} from '@/interface-adapters/validation-schemas/links'
import { authenticatedProcedure } from '@/web/_lib/zsa-procedures'

export const createLink = async (input: CreateLinkInput) => {
  try {
    await createLinkController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError('You must be logged in to create a link.')
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError("You're not authorized to create a link.")
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath('/app/links')

  return { message: 'Link created successfully' }
}

export const updateLink = authenticatedProcedure
  .createServerAction()
  .input(updateLinkInputSchema)
  .handler(async ({ input }) => {
    const { fingerprint, ...linkData } = input

    let link: Link
    try {
      link = await getLinkUseCase(fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    let updatedLink: Link
    try {
      updatedLink = await updateLinkUseCase(link, linkData)
    } catch (err) {
      // TODO: report to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/app/links')
    return { message: 'Link updated successfully' }
  })

export const deleteLink = authenticatedProcedure
  .createServerAction()
  .input(deleteLinkInputSchema)
  .handler(async ({ input }) => {
    let link: Link
    try {
      link = await getLinkUseCase(input.fingerprint)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    try {
      await deleteLinkUseCase(link)
    } catch (err) {
      // TODO: report to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/app/links')
    return { message: 'Link deleted successfully' }
  })

export const toggleLinkVisibility = authenticatedProcedure
  .createServerAction()
  .input(toggleLinkVisibilityInputSchema)
  .handler(async ({ input }) => {
    let link: Link
    try {
      link = await getLinkUseCase(input.link_pk)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    let collection: Collection
    try {
      collection = await getCollectionUseCase(input.collection_pk)
    } catch (err) {
      throw new ZSAError('ERROR', err)
    }

    try {
      await updateLinkVisibilityUseCase(link, collection, input.checked)
    } catch (err) {
      // TODO: report to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${collection.fingerprint}`)
    revalidatePath(`/${collection.fingerprint}`)
  })
