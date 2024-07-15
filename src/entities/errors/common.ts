export class OperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class UniqueConstraintViolationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
