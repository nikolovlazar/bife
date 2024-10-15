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

  async getLinksForUser(
    userId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<{ links: Link[]; totalCount: number }> {
    const allLinks = this._links.filter((l) => l.created_by === userId)
    const totalCount = allLinks.length

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedLinks = allLinks.slice(startIndex, endIndex)

    if (paginatedLinks.length === 0 && page > 1) {
      throw new NotFoundError('No links found for the given page')
    }

    return Promise.resolve({
      links: LinksSchema.parse(paginatedLinks),
      totalCount,
    })
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
