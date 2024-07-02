import { Collection } from '@/utils/types'

import { IDTO } from '.'

export class CollectionDTO implements IDTO {
  constructor(
    private _fingerprint: string,
    private _title: string,
    private _description: string | undefined | null,
    private _published: boolean,
    private _created_by: string,
    private _created_at: string
  ) {}

  public toJSON() {
    return JSON.stringify({
      fingerprint: this.fingerprint,
      title: this.title,
      description: this.description,
      published: this.published,
      created_by: this.created_by,
      created_at: this.created_at,
    })
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
    return new CollectionDTO(
      data.fingerprint,
      data.title,
      data.description,
      data.published,
      data.created_by,
      data.created_at
    )
  }
}
