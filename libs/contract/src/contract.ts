import { initContract } from '@ts-rest/core';
import { authContract } from './features/auth';
import { userContract } from './features/user';
import { gameContract } from './features/game';

const c = initContract();

export const contract = c.router(
  {
    auth: authContract,
    user: userContract,
    game: gameContract
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/api'
  }
);

export type Contract = typeof contract;
