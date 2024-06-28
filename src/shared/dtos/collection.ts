import type { Collection } from '@/utils/types'

export class CollectionDTO {
  private _created_at: string
  private _created_by: string
  private _description: string | null
  private _fingerprint: string
  private _published: boolean
  private _title: string

  constructor({
    created_at,
    created_by,
    description,
    fingerprint,
    published,
    title,
  }: {
    created_at: string
    created_by: string
    description: string | null
    fingerprint: string
    published: boolean
    title: string
  }) {
    this._created_at = created_at
    this._created_by = created_by
    this._description = description
    this._fingerprint = fingerprint
    this._published = published
    this._title = title
  }

  public get created_at() {
    return this._created_at
  }

  public get created_by() {
    return this._created_by
  }

  public get description() {
    return this._description
  }

  public get fingerprint() {
    return this._fingerprint
  }

  public get published() {
    return this._published
  }

  public get title() {
    return this._title
  }

  static fromDb(data: Collection) {
    return new CollectionDTO({
      fingerprint: data.fingerprint,
      title: data.title,
      description: data.description,
      published: data.published,
      created_at: data.created_at,
      created_by: data.created_by,
    })
  }
}
