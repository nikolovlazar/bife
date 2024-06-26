// TODO: Fix import order for '.' imports
import { ICollectionsRepository } from '.'
import { SupabaseClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

import { createClient } from '@/utils/supabase/server'

import { CollectionDTO } from '@/dtos/collection'
import { UserDTO } from '@/dtos/users'

// Live / Production Repository
export class CollectionsRepository implements ICollectionsRepository {
  private db: SupabaseClient

  constructor() {
    this.db = createClient()
  }

  async createCollection(collection: CollectionDTO, user: UserDTO) {
    const { title, description } = collection

    const fingerprint = nanoid(8)

    const { data, error: creationError } = await this.db
      .from('collection')
      .insert({
        created_at: new Date().toUTCString(),
        created_by: user.id,
        title,
        description,
        fingerprint,
      })
      .select()
      .single()

    if (creationError) {
      throw new Error('Failed to create collection', { cause: creationError })
    }

    const newCollection = CollectionDTO.fromDb(data)
    return newCollection
  }
}
