import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { authRouter } from '../auth/auth.router';
import { userRouter } from '../user/user.router';

const s = initServer();

export const router = s.router(contract, {
  auth: authRouter,
  user: userRouter
});
