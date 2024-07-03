'use server'

import { revalidatePath } from 'next/cache'
import { ZSAError } from 'zsa'

import {
  createLinkInputSchema,
  deleteLinkInputSchema,
  toggleLinkVisibilityInputSchema,
  updateLinkInputSchema,
} from '@/app/_lib/validation-schemas/links'
import { authenticatedProcedure } from '@/app/_lib/zsa-procedures'

import { ServiceLocator } from '@/services/serviceLocator'
import type { CollectionLinkDTO } from '@/shared/dtos/collectionLink'
import { LinkDTO } from '@/shared/dtos/link'
import { OperationError } from '@/shared/errors/commonErrors'

export const createLink = authenticatedProcedure
  .createServerAction()
  .input(createLinkInputSchema)
  .handler(async ({ input }) => {
    const linksService = ServiceLocator.getService('LinksService')

    let link: LinkDTO

    const { collection, ...linkInput } = input

    try {
      link = await linksService.createLink(linkInput, collection)
    } catch (err) {
      // TODO: report to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath('/app/links')
    return { message: 'Link created successfully' }
  })

export const updateLink = authenticatedProcedure
  .createServerAction()
  .input(updateLinkInputSchema)
  .handler(async ({ input }) => {
    const linksService = ServiceLocator.getService('LinksService')

    let link: LinkDTO

    const { fingerprint, ...linkData } = input

    try {
      link = await linksService.updateLink(fingerprint, linkData)
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
    const linksService = ServiceLocator.getService('LinksService')

    try {
      await linksService.deleteLink(input.fingerprint)
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
    const collectionLinkService = ServiceLocator.getService(
      'CollectionLinkService'
    )

    let updated: CollectionLinkDTO

    try {
      updated = await collectionLinkService.setVisibility(
        input.collection_pk,
        input.link_pk,
        input.checked
      )
    } catch (err) {
      // TODO: report to Sentry
      if (err instanceof OperationError) {
        throw new ZSAError('ERROR', err.message)
      }
      throw new ZSAError('ERROR', err)
    }

    revalidatePath(`/app/collections/${input.collection_pk}`)
    return updated
  })
