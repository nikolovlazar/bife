import { injectable } from 'inversify'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

import {
  Collection,
  CollectionInsert,
  CollectionSchema,
  CollectionUpdate,
  CollectionsSchema,
} from '@/entities/models/collection'

import { createClient } from '@/infrastructure/utils/supabase/server'

import { mapPostgrestErrorToDomainError } from '../utils/supabase/errors'

@injectable()
export class CollectionsRepository implements ICollectionsRepository {
  constructor() {}

  async createCollection(
    collection: CollectionInsert,
    userId: string,
    fingerprint: string
  ) {
    const db = createClient()
    const { title, description } = collection

    const { data, error } = await db
      .from('collection')
      .insert({
        created_at: new Date().toUTCString(),
        created_by: userId,
        title,
        description,
        fingerprint,
      })
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionSchema.parse(data)
  }

  async getCollection(fingerprint: string) {
    const db = createClient()
    const { data, error } = await db
      .from('collection')
      .select()
      .eq('fingerprint', fingerprint)
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionSchema.parse(data)
  }

  async getCollectionsForUser(userId: string) {
    const db = createClient()
    const { data, error } = await db
      .from('collection')
      .select()
      .eq('created_by', userId)

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionsSchema.parse(data)
  }

  async updateCollection(fingerprint: string, input: CollectionUpdate) {
    const db = createClient()
    const { data, error } = await db
      .from('collection')
      .update({
        title: input.title,
        description: input.description,
        published: input.published,
      })
      .eq('fingerprint', fingerprint)
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionSchema.parse(data)
  }

  async deleteCollection(fingerprint: string): Promise<Collection> {
    const db = createClient()
    const { data, error } = await db
      .from('collection')
      .delete()
      .eq('fingerprint', fingerprint)
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionSchema.parse(data)
  }
}
