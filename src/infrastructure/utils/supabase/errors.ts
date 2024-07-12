import { type PostgrestError } from '@supabase/supabase-js'

import { NotFoundError, OperationError } from '@/entities/errors/common'

export const PostgrestErrorCodes = {
  NOT_FOUND: 'PGRST116',
}

export function mapPostgrestErrorToDomainError(error: PostgrestError) {
  switch (error.code) {
    case PostgrestErrorCodes.NOT_FOUND:
      return new NotFoundError(error.message, {
        cause: error,
      })
    default:
      return new OperationError(error.message, {
        cause: error,
      })
  }
}
