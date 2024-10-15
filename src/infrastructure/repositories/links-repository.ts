import { injectable } from 'inversify'

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

  async getLinksForUser(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ links: Link[]; totalCount: number }> {
    const db = createClient()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await db
      .from('link')
      .select('*', { count: 'exact' })
      .eq('created_by', userId)
      .range(from, to)

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return {
      links: LinksSchema.parse(data),
      totalCount: count || 0,
    }
  }

  async createLink(
    link: LinkInsert,
    userId: string,
    fingerprint: string
  ): Promise<Link> {
    const db = createClient()

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
