import { ERROR_KINDS, ErrorKind } from '@dungeon-crawler/contract';
import { AnyObject, Values, Nullable } from '@dungeon-crawler/shared';
import { ErrorHttpStatusCode } from '@ts-rest/core';
import { mapLeft } from 'fp-ts/Either';

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  UNPROCESSABLE_ENTITY: 422,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429
} as const;
export type HttpStatusCode = Values<typeof HTTP_STATUS_CODES>;

export class AppError extends Error {
  isAppError = true;

  constructor(
    public message: string,
    public statusCode: HttpStatusCode & ErrorHttpStatusCode,
    public kind: ErrorKind,
    public meta: Nullable<AnyObject>,
    public cause?: unknown
  ) {
    super(message);
  }
}

export const isAppError = (x: unknown): x is AppError => {
  return x instanceof AppError;
};

export const createAppError =
  <T = AppError>(
    statusCode: HttpStatusCode & ErrorHttpStatusCode,
    defaultMessage: string,
    defaultKind: ErrorKind
  ) =>
  ({
    meta,
    message,
    kind,
    cause
  }: { meta?: AnyObject; message?: string; kind?: ErrorKind; cause?: Error } = {}): T =>
    new AppError(
      message ?? defaultMessage,
      statusCode,
      kind ?? defaultKind,
      meta,
      cause
    ) as T;

export type UnprocessableError = AppError & {
  statusCode: 422;
};

export type UnauthorizedError = AppError & {
  statusCode: 401;
};

export type ForbiddenError = AppError & {
  statusCode: 403;
};

export type NotFoundError = AppError & {
  statusCode: 404;
};

export type BadRequestError = AppError & {
  statusCode: 400;
};

export type UnexpectedError = AppError & {
  statusCode: 500;
};

export const errorFactory = {
  unprocessable: createAppError<UnprocessableError>(
    HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY,
    'Unprocessable Entity',
    ERROR_KINDS.BAD_REQUEST
  ),
  unauthorized: createAppError<UnauthorizedError>(
    HTTP_STATUS_CODES.UNAUTHORIZED,
    'Unauthorized',
    ERROR_KINDS.UNAUTHORIZED
  ),
  badRequest: createAppError<BadRequestError>(
    HTTP_STATUS_CODES.BAD_REQUEST,
    'Bad request',
    ERROR_KINDS.BAD_REQUEST
  ),
  unexpected: createAppError<UnexpectedError>(
    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    'Internal Server error',
    ERROR_KINDS.UNEXPECTED
  ),
  forbidden: createAppError<ForbiddenError>(
    HTTP_STATUS_CODES.FORBIDDEN,
    'Forbidden',
    ERROR_KINDS.FORBIDDEN
  ),
  notFound: createAppError<NotFoundError>(
    HTTP_STATUS_CODES.NOT_FOUND,
    'Not found',
    ERROR_KINDS.NOT_FOUND
  )
};

export type ErrorFactory = typeof errorFactory;

export const toUnauthorized = mapLeft(() => errorFactory.unauthorized());
export const toForbidden = mapLeft(() => errorFactory.forbidden());
export const toBadRequest = mapLeft(() => errorFactory.badRequest());
