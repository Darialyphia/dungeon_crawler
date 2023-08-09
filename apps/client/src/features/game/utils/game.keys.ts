import { createQueryKeys, type inferQueryKeys } from '@lukemorales/query-key-factory';

export const gameKeys = createQueryKeys('game', {
  getAll: null
});

export type GameDefs = typeof gameKeys;
export type GameKeys = inferQueryKeys<typeof gameKeys>;
