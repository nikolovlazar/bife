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

export class UnauthorizedError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
