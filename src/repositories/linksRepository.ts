import { nanoid } from 'nanoid'

import { createClient } from '@/utils/supabase/server'
import { LinkInsert, LinkUpdate } from '@/utils/types'

import { LinkDTO, LinkDTOSchema } from '@/shared/dtos/link'
import { OperationError } from '@/shared/errors/commonErrors'

import { ILinksRepository } from '.'

export class LinksRepository implements ILinksRepository {
  constructor() {}

  async getLink(fingerprint: string): Promise<LinkDTO> {
    const db = createClient()
    const { data, error } = await db
      .from('link')
      .select()
      .eq('fingerprint', fingerprint)
      .single()

    if (error) {
      throw new OperationError(error.message, {
        cause: error,
      })
    }

    return LinkDTOSchema.parse(data)
  }

  async createLink(link: LinkInsert, userId: string): Promise<LinkDTO> {
    const db = createClient()
    const fingerprint = nanoid(8)

    // TODO: check collision

    const { data, error } = await db
      .from('link')
      .insert({
        created_at: new Date().toUTCString(),
        created_by: userId,
        url: link.url,
        label: link.label,
        fingerprint,
      })
      .select()
      .single()

    if (error) {
      throw new OperationError(error.message, {
        cause: error,
      })
    }

    return LinkDTOSchema.parse(data)
  }

  async updateLink(fingerprint: string, data: LinkUpdate): Promise<LinkDTO> {
    const db = createClient()
    const { data: updatedLink, error } = await db
      .from('link')
      .update(data)
      .eq('fingerprint', fingerprint)
      .select()
      .single()

    if (error) {
      throw new OperationError(error.message, {
        cause: error,
      })
    }

    return LinkDTOSchema.parse(updatedLink)
  }

  async deleteLink(fingerprint: string): Promise<void> {
    const db = createClient()
    const { error } = await db
      .from('link')
      .delete()
      .eq('fingerprint', fingerprint)

    if (error) {
      throw new OperationError(error.message, {
        cause: error,
      })
    }
  }
  setLinkVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ): Promise<LinkDTO> {
    throw new Error('Method not implemented.')
  }
}
