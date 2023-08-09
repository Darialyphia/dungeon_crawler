import { initContract } from '@ts-rest/core';
import { ErrorResponse } from '../core';
import { GameCapacity, GameResponse } from './game.schemas';
import { z } from 'zod';

const c = initContract();

export const gameContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      responses: {
        200: GameResponse.array(),
        500: ErrorResponse
      },
      metadata: { needsAuth: true }
    },
    create: {
      method: 'POST',
      path: '/',
      responses: {
        201: GameResponse,
        500: GameResponse,
        400: ErrorResponse,
        401: ErrorResponse
      },
      body: z.object({
        name: z.string(),
        capacity: GameCapacity
      }),
      metadata: { needsAuth: true }
    },
    join: {
      method: 'POST',
      path: '/:gameId/join',
      responses: {
        200: GameResponse,
        500: ErrorResponse,
        401: ErrorResponse,
        404: ErrorResponse,
        400: ErrorResponse
      },
      body: null,
      metadata: { needsAuth: true }
    },
    leave: {
      method: 'POST',
      path: '/:gameId/join',
      responses: {
        200: GameResponse,
        500: ErrorResponse,
        401: ErrorResponse,
        404: ErrorResponse,
        400: ErrorResponse
      },
      body: null,
      metadata: { needsAuth: true }
    }
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/games'
  }
);

export type GameContract = typeof gameContract;
