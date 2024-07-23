'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { UnauthenticatedError, UnauthorizedError } from '@/entities/errors/auth'
import { InputParseError, OperationError } from '@/entities/errors/common'

import { addLinkToCollectionController } from '@/interface-adapters/controllers/add-link-to-collection.controller'
import {
  CreateCollectionControllerOutput,
  createCollectionController,
} from '@/interface-adapters/controllers/create-collection.controller'
import { deleteCollectionController } from '@/interface-adapters/controllers/delete-collection.controller'
import { removeLinkFromCollectionController } from '@/interface-adapters/controllers/remove-link-from-collection.controller'
import { toggleCollectionPublishedController } from '@/interface-adapters/controllers/toggle-collection-published.controller'
import { updateCollectionController } from '@/interface-adapters/controllers/update-collection.controller'
import { updateLinksOrderController } from '@/interface-adapters/controllers/update-links-order.controller'
import {
  AddLinkToCollectionInput,
  CreateCollectionInput,
  DeleteCollectionInput,
  RemoveLinkFromCollectionInput,
  ToggleCollectionPublishedInput,
  UpdateCollectionInput,
  UpdateLinksOrderInput,
} from '@/interface-adapters/validation-schemas/collections'

export const createCollection = async (input: CreateCollectionInput) => {
  let output: CreateCollectionControllerOutput

  try {
    output = await createCollectionController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to create a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to create a collection."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  redirect(`/app/collections/${output.fingerprint}`)
}

export const updateCollection = async (input: UpdateCollectionInput) => {
  try {
    await updateCollectionController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to update a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to update the collection."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.fingerprint}`)
}

export const deleteCollection = async (input: DeleteCollectionInput) => {
  try {
    await deleteCollectionController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to delete a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to delete the collection."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath('/app/collections')
  redirect('/app/collections')
}

export const toggleCollectionPublished = async (
  input: ToggleCollectionPublishedInput
) => {
  try {
    await toggleCollectionPublishedController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to publish/unpublish a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        `You're not authorized to ${input.checked ? 'publish' : 'unpublish'} the collection.`
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.fingerprint}`)
}

export const addLinkToCollection = async (input: AddLinkToCollectionInput) => {
  try {
    await addLinkToCollectionController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to add links to a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to add the link to the collection."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.fingerprint}`)
}

export const removeLinkFromCollection = async (
  input: RemoveLinkFromCollectionInput
) => {
  try {
    await removeLinkFromCollectionController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to remove links to a collection.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to remove the link to the collection."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.fingerprint}`)
  revalidatePath(`/${input.fingerprint}`)
}

export const updateLinksOrder = async (input: UpdateLinksOrderInput) => {
  try {
    await updateLinksOrderController(input)
  } catch (err) {
    if (err instanceof InputParseError) {
      throw new InputParseError(err.message)
    }
    if (err instanceof UnauthenticatedError) {
      throw new UnauthenticatedError(
        'You must be logged in to update links order.'
      )
    }
    if (err instanceof UnauthorizedError) {
      throw new UnauthorizedError(
        "You're not authorized to update the links order."
      )
    }
    if (err instanceof OperationError) {
      throw new OperationError(err.message)
    }
    throw err
  }

  revalidatePath(`/app/collections/${input.fingerprint}`)
  revalidatePath(`/${input.fingerprint}`)
}
