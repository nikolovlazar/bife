import { injectable } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'

import {
  CollectionLinkSchema,
  CollectionLinks,
  CollectionLinksSchema,
} from '@/entities/models/collection-link'

import { createClient } from '@/infrastructure/utils/supabase/server'

import { mapPostgrestErrorToDomainError } from '../utils/supabase/errors'

@injectable()
export class CollectionLinkRepository implements ICollectionLinkRepository {
  constructor() {}

  async getRelation(collectionFingerprint: string, linkFingerprint: string) {
    const db = createClient()
    const { data, error } = await db
      .from('collection_link')
      .select()
      .eq('collection_pk', collectionFingerprint)
      .eq('link_pk', linkFingerprint)
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionLinkSchema.parse(data)
  }

  async setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ) {
    const db = createClient()
    const { data, error } = await db
      .from('collection_link')
      .update({ visible: visibility })
      .eq('collection_pk', collectionFingerprint)
      .eq('link_pk', linkFingerprint)
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionLinkSchema.parse(data)
  }

  async addLinkToCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ) {
    const db = createClient()
    const { data, error } = await db
      .from('collection_link')
      .insert({
        collection_pk: collectionFingerprint,
        link_pk: linkFingerprint,
        visible: true,
      })
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionLinkSchema.parse(data)
  }

  async removeLinkFromCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ) {
    const db = createClient()
    const { data, error } = await db
      .from('collection_link')
      .delete()
      .eq('collection_pk', collectionFingerprint)
      .eq('link_pk', linkFingerprint)
      .select()
      .single()

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    return CollectionLinkSchema.parse(data)
  }

  async updateLinksOrder(
    collectionFingerprint: string,
    linksOrder: { fingerprint: string; order: number }[]
  ) {
    const db = createClient()
    const { error } = await db.from('collection_link').upsert(
      linksOrder.map(({ fingerprint, order }) => ({
        link_pk: fingerprint,
        collection_pk: collectionFingerprint,
        order,
      })),
      { onConflict: 'link_pk,collection_pk' }
    )

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }
  }

  async getLinksForCollection(
    collectionFingerprint: string
  ): Promise<CollectionLinks> {
    const db = createClient()
    const { data, error } = await db
      .from('collection_link')
      .select('visible, order, link(*)')
      .order('order', { ascending: true })
      .eq('collection_pk', collectionFingerprint)

    if (error) {
      throw mapPostgrestErrorToDomainError(error)
    }

    const nonNullLinks = data.filter((entry) => entry.link !== null)

    return CollectionLinksSchema.parse(nonNullLinks)
  }
}
