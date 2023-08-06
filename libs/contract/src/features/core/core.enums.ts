import type { Values } from '@dungeon-crawler/shared';

export const ERROR_KINDS = {
  UNEXPECTED: 'UNEXPECTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;
export type ErrorKind = Values<typeof ERROR_KINDS>;
