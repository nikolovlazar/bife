import {
  NotFoundError,
  OperationError,
  UniqueConstraintViolationError,
} from '@/entities/errors/common'

export const PostgrestErrorCodes = {
  NOT_FOUND: 'PGRST116',
  UNIQUE_CONSTRAINT_VIOLATION: '23505',
}

export function mapPostgrestErrorToDomainError(error: {
  code: string
  message: string
}) {
  switch (error.code) {
    case PostgrestErrorCodes.NOT_FOUND:
      return new NotFoundError(error.message, {
        cause: error,
      })
    case PostgrestErrorCodes.UNIQUE_CONSTRAINT_VIOLATION:
      return new UniqueConstraintViolationError(error.message, {
        cause: error,
      })
    default:
      return new OperationError(error.message, {
        cause: error,
      })
  }
}
