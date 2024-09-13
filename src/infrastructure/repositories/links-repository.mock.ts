import { injectable } from 'inversify'

import { ILinksRepository } from '@/application/repositories/links-repository.interface'

import {
  NotFoundError,
  UniqueConstraintViolationError,
} from '@/entities/errors/common'
import {
  Link,
  LinkInsert,
  LinkSchema,
  LinkUpdate,
  LinkUpdateSchema,
  LinksSchema,
} from '@/entities/models/link'

@injectable()
export class MockLinksRepository implements ILinksRepository {
  private _links: Link[]

  constructor() {
    this._links = []
  }

  async getLink(fingerprint: string): Promise<Link> {
    const link = this._links.find((l) => l.fingerprint === fingerprint)

    if (!link) {
      throw new NotFoundError('Cannot find a link with that fingerprint')
    }

    return Promise.resolve(LinkSchema.parse(link))
  }

  async getLinksForUser(userId: string): Promise<Link[]> {
    const links = this._links.filter((l) => l.created_by === userId)

    if (links.length === 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    return Promise.resolve(LinksSchema.parse(links))
  }

  async createLink(
    link: LinkInsert,
    userId: string,
    fingerprint: string
  ): Promise<Link> {
    const existingLink = this._links.find((l) => l.fingerprint === fingerprint)
    if (existingLink) {
      throw new UniqueConstraintViolationError(
        'duplicate key value violates unique constraint'
      )
    }

    const { url, label } = link

    const newLink: Link = {
      fingerprint,
      url,
      label,
      created_by: userId,
      created_at: new Date().toUTCString(),
    }

    this._links.push(newLink)

    return Promise.resolve(LinkSchema.parse(newLink))
  }

  async updateLink(fingerprint: string, input: LinkUpdate): Promise<Link> {
    const linkIndex = this._links.findIndex(
      (l) => l.fingerprint === fingerprint
    )

    if (linkIndex < 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    const data = LinkUpdateSchema.parse(input)

    let link = this._links[linkIndex]
    link = { ...link, ...data }
    this._links[linkIndex] = link

    return Promise.resolve(LinkSchema.parse(link))
  }

  async deleteLink(fingerprint: string): Promise<void> {
    const linkIndex = this._links.findIndex(
      (l) => l.fingerprint === fingerprint
    )

    if (linkIndex < 0) {
      throw new NotFoundError('multiple (or no) rows returned')
    }

    delete this._links[linkIndex]
    this._links = this._links.filter(Boolean)

    return Promise.resolve()
  }
}
