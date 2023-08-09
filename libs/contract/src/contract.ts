import { initContract } from '@ts-rest/core';
import { authContract } from './features/auth';
import { userContract } from './features/user';
import { lobbyContract } from './features/lobby';

const c = initContract();

export const contract = c.router(
  {
    auth: authContract,
    user: userContract,
    lobby: lobbyContract
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/api'
  }
);

export type Contract = typeof contract;
