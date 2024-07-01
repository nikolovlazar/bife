export class AuthError extends Error {
  status: number | undefined

  constructor(
    message: string,
    status: number | undefined,
    options: ErrorOptions
  ) {
    super(message, options)
    this.status = status
  }
}
