// TODO: Fix import order for '.' imports
import { ICollectionsRepository } from '.'
import { SupabaseClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

import { createClient } from '@/utils/supabase/server'
import { CollectionInsert, CollectionUpdate } from '@/utils/types'

import { CollectionDTO } from '@/shared/dtos/collection'
import { Database } from '~/supabase/types.gen'
import { CreateCollectionError, UpdateCollectionError } from '@/shared/errors/collectionErrors'

// Live / Production Repository
export class CollectionsRepository implements ICollectionsRepository {
  private _db: SupabaseClient<Database>

  constructor() {
    this._db = createClient()
  }

  async createCollection(collection: CollectionInsert, userId: string) {
    const { title, description } = collection

    const fingerprint = nanoid(8)

    const { data, error: creationError } = await this._db
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

    if (creationError) {
      throw new CreateCollectionError(creationError.message, { cause: creationError })
    }

    const newCollection = CollectionDTO.fromDb(data)
    return newCollection
  }

  async getCollection(fingerprint: string) {
    const { data, error } = await this._db
      .from('collection')
      .select()
      .eq('fingerprint', fingerprint)
      .single()

    if (error) {
      throw new Error('Failed to get collection', { cause: error })
    }

    const collection = CollectionDTO.fromDb(data)
    return collection
  }

  async getUsersCollection(fingerprint: string, userId: string) {
    const { data, error } = await this._db
      .from('collection')
      .select()
      .eq('fingerprint', fingerprint)
      .eq('created_by', userId)
      .single()

    if (error) {
      // TODO: create custom error here
      throw new Error('Failed to get collection', { cause: error })
    }

    const collection = CollectionDTO.fromDb(data)
    return collection
  }

  async updateCollection(fingerprint: string, input: CollectionUpdate) {
    const { data, error } = await this._db
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
      throw new UpdateCollectionError(error.message, { cause: error })
    }

    return CollectionDTO.fromDb(data)
  }

  async deleteCollection(fingerprint: string): Promise<CollectionDTO> {
    const { data, error } = await this._db
      .from('collection')
      .delete()
      .eq('fingerprint', fingerprint)
      .select()
      .single()

    if (error) {
      // TODO: create custom error here
      throw new Error('Failed to delete collection', { cause: error })
    }

    return CollectionDTO.fromDb(data)
  }
}
