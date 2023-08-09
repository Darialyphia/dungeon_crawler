import { initContract } from '@ts-rest/core';
import { ErrorResponse } from '../core';
import { GameResponse } from './game.schemas';

const c = initContract();

export const gameContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      responses: {
        200: GameResponse.array(),
        500: ErrorResponse
      }
    }
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/games'
  }
);

export type GameContract = typeof gameContract;
