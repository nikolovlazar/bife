import { nanoid } from 'nanoid'

import { createClient } from '@/utils/supabase/server'
import { CollectionInsert, CollectionUpdate } from '@/utils/types'

import { Collection, CollectionSchema } from '@/shared/dtos/collection'
import { OperationError } from '@/shared/errors/commonErrors'

import { ICollectionsRepository } from '.'

// Live / Production Repository
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
