import { initContract } from '@ts-rest/core';
import { ErrorResponse } from '../core';
import { LobbyResponse } from './lobby.schemas';

const c = initContract();

export const lobbyContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      responses: {
        200: LobbyResponse.array(),
        500: ErrorResponse
      }
    }
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/lobbies'
  }
);

export type LobbyContract = typeof lobbyContract;
