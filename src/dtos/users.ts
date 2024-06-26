export class UserDTO {
  private _id: string
  private _role?: string

  constructor(id: string, role?: string) {
    this._id = id
    this._role = role
  }

  public get id() {
    return this._id
  }
  public get role() {
    return this._role
  }

  static fromDb(data: any) {
    // TODO: implement
  }
}
