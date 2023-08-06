import { initContract } from '@ts-rest/core';
import { authContract } from './features/auth';
import { userContract } from './features/user';

const c = initContract();

export const contract = c.router(
  {
    auth: authContract,
    user: userContract
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/api'
  }
);

export type Contract = typeof contract;
