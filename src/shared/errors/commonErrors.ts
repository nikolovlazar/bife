export class OperationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
