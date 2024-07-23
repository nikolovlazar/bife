import { inject, injectable } from 'inversify'

import { ICollectionLinkRepository } from '@/application/repositories/collection-link-repository.interface'
import type { ILinksRepository } from '@/application/repositories/links-repository.interface'

import { NotFoundError } from '@/entities/errors/common'
import {
  CollectionLink,
  CollectionLinkSchema,
  CollectionLinks,
  CollectionLinksSchema,
} from '@/entities/models/collection-link'

import { DI_SYMBOLS } from '@/di/types'

@injectable()
export class MockCollectionLinkRepository implements ICollectionLinkRepository {
  private _relations: CollectionLink[]

  constructor(
    @inject(DI_SYMBOLS.ILinksRepository)
    private _linksRepository: ILinksRepository
  ) {
    this._relations = []
  }

  async setVisibility(
    collectionFingerprint: string,
    linkFingerprint: string,
    visibility: boolean
  ) {
    const relationIndex = this._relations.findIndex(
      (r) =>
        r.collection_pk === collectionFingerprint &&
        r.link_pk === linkFingerprint
    )

    if (relationIndex < 0) {
      throw new NotFoundError('Cannot find that link/collection combination')
    }

    let relation = this._relations[relationIndex]
    relation.visible = visibility
    this._relations[relationIndex] = relation

    return Promise.resolve(CollectionLinkSchema.parse(relation))
  }

  async addLinkToCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ) {
    const numberOfExistingLinks = this._relations.filter(
      (r) => r.collection_pk === collectionFingerprint
    ).length

    const relation: CollectionLink = {
      collection_pk: collectionFingerprint,
      link_pk: linkFingerprint,
      visible: true,
      order: numberOfExistingLinks + 1,
    }
    this._relations.push(relation)

    return Promise.resolve(CollectionLinkSchema.parse(relation))
  }

  async removeLinkFromCollection(
    collectionFingerprint: string,
    linkFingerprint: string
  ) {
    const relationIndex = this._relations.findIndex(
      (r) =>
        r.collection_pk === collectionFingerprint &&
        r.link_pk === linkFingerprint
    )

    if (relationIndex < 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    const relation = this._relations[relationIndex]

    delete this._relations[relationIndex]
    this._relations = this._relations.filter(Boolean)

    return Promise.resolve(CollectionLinkSchema.parse(relation))
  }

  async updateLinksOrder(
    collectionFingerprint: string,
    linksOrder: { fingerprint: string; order: number }[]
  ) {
    linksOrder.forEach((lo) => {
      const relationIndex = this._relations.findIndex(
        (r) =>
          r.collection_pk === collectionFingerprint &&
          r.link_pk === lo.fingerprint
      )
      if (relationIndex < 0) {
        throw new NotFoundError('multiple (or no) rows returned')
      }

      const relation = this._relations[relationIndex]
      relation.order = lo.order

      this._relations[relationIndex] = relation
    })
    return Promise.resolve()
  }

  async getLinksForCollection(
    collectionFingerprint: string
  ): Promise<CollectionLinks> {
    const relations = this._relations.filter(
      (r) => r.collection_pk === collectionFingerprint
    )

    if (relations.length === 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    const collectionLinks = await Promise.all(
      relations.map(async (relation) => ({
        visible: relation.visible,
        order: relation.order,
        link: await this._linksRepository.getLink(relation.link_pk),
      }))
    )

    return Promise.resolve(CollectionLinksSchema.parse(collectionLinks))
  }
}
