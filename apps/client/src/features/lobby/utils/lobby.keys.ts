import { createQueryKeys, type inferQueryKeys } from '@lukemorales/query-key-factory';

export const lobbyKeys = createQueryKeys('lobby', {
  getAll: null
});

export type LobbyDefs = typeof lobbyKeys;
export type LobbyKeys = inferQueryKeys<typeof lobbyKeys>;
