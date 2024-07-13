import { injectable } from 'inversify'
import { nanoid } from 'nanoid'

import { ILinksRepository } from '@/application/repositories/links-repository.interface'

import {
  Link,
  LinkInsert,
  LinkSchema,
  LinkUpdate,
  LinksSchema,
} from '@/entities/models/link'

import { createClient } from '@/infrastructure/utils/supabase/server'

import { mapPostgrestErrorToDomainError } from '../utils/supabase/errors'

@injectable()
export class LinksRepository implements ILinksRepository {
  constructor() {}

  async getLink(fingerprint: string): Promise<Link> {
    const db = createClient()
    const { data, error } = await db
      .from('link')
      .select()
      .eq('fingerprint', fingerprint)
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return LinkSchema.parse(data)
  }

  async getLinksForUser(userId: string): Promise<Link[]> {
    const db = createClient()
    const { data, error } = await db
      .from('link')
      .select()
      .eq('created_by', userId)

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return LinksSchema.parse(data)
  }

  async createLink(link: LinkInsert, userId: string): Promise<Link> {
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
      throw mapPostgrestErrorToDomainError(error)
    }

    return LinkSchema.parse(data)
  }

  async updateLink(fingerprint: string, data: LinkUpdate): Promise<Link> {
    const db = createClient()
    const { data: updatedLink, error } = await db
      .from('link')
      .update(data)
      .eq('fingerprint', fingerprint)
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return LinkSchema.parse(updatedLink)
  }

  async deleteLink(fingerprint: string): Promise<void> {
    const db = createClient()
    const { error } = await db
      .from('link')
      .delete()
      .eq('fingerprint', fingerprint)

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }
  }
}
