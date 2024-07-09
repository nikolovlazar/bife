import { injectable } from 'inversify'
import { nanoid } from 'nanoid'

import { ICollectionsRepository } from '@/application/repositories/collections-repository.interface'

import { OperationError } from '@/entities/errors/common'
import {
  Collection,
  CollectionInsert,
  CollectionSchema,
  CollectionUpdate,
} from '@/entities/models/collection'

import { createClient } from '@/infrastructure/utils/supabase/server'

@injectable()
export class CollectionsRepository implements ICollectionsRepository {
  constructor() {}

  async createCollection(collection: CollectionInsert, userId: string) {
    const db = createClient()
    const { title, description } = collection

    const fingerprint = nanoid(8)

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
      throw new OperationError(error.message, {
        cause: error,
      })
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
      throw new OperationError(error.message, { cause: error })
    }

    return CollectionSchema.parse(data)
  }

  async getUsersCollection(fingerprint: string, userId: string) {
    const db = createClient()
    const { data, error } = await db
      .from('collection')
      .select()
      .eq('fingerprint', fingerprint)
      .eq('created_by', userId)
      .single()

    if (error) {
      throw new OperationError(error.message, { cause: error })
    }

    return CollectionSchema.parse(data)
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
      throw new OperationError(error.message, { cause: error })
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
      throw new OperationError(error.message, { cause: error })
    }

    return CollectionSchema.parse(data)
  }
}
