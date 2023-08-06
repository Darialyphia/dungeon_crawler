import { ErrorResponse } from '@dungeon-crawler/contract';
import { AppError } from '../../../utils/errorFactory';
import { isObject, isString } from 'lodash';

export type ErrorMapper = {
  toResponse<T extends AppError>(err: T): ErrorResponse;
};
export const errorMapper = (): ErrorMapper => {
  return {
    toResponse(err) {
      return {
        kind: err.kind,
        message: err.message,
        cause:
          isObject(err.cause) && 'message' in err.cause && isString(err.cause.message)
            ? err.cause.message
            : undefined
      };
    }
  };
};
