'use server'

import { revalidatePath } from 'next/cache'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError, OperationError } from '@/entities/errors/common'

import { createLinkController } from '@/interface-adapters/controllers/create-link.controller'
import { deleteLinkController } from '@/interface-adapters/controllers/delete-link.controller'
import { toggleLinkVisibilityController } from '@/interface-adapters/controllers/toggle-link-visibility.controller'
import { updateLinkController } from '@/interface-adapters/controllers/update-link.controller'
import {
  CreateLinkInput,
  DeleteLinkInput,
  ToggleLinkVisibilityInput,
  UpdateLinkInput,
} from '@/interface-adapters/validation-schemas/links'

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

export const updateLink = async (input: UpdateLinkInput) => {
  try {
    await updateLinkController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError('You must be logged in to update a link.')
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError("You're not authorized to update a link.")
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath('/app/links')
  return { message: 'Link updated successfully' }
}

export const deleteLink = async (input: DeleteLinkInput) => {
  try {
    await deleteLinkController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError('You must be logged in to delete a link.')
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError("You're not authorized to delete a link.")
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath('/app/links')
  return { message: 'Link deleted successfully' }
}

export const toggleLinkVisibility = async (
  input: ToggleLinkVisibilityInput
) => {
  try {
    await toggleLinkVisibilityController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to toggle link visibility.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to toggle link visibility."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.collection_pk}`)
  revalidatePath(`/${input.collection_pk}`)
}
