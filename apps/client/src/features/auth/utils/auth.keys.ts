import { createQueryKeys, type inferQueryKeys } from '@lukemorales/query-key-factory';

export const authKeys = createQueryKeys('auth', {
  token: null,
  session: null
});

export type AuthDefs = typeof authKeys;
export type AuthKeys = inferQueryKeys<typeof authKeys>;
