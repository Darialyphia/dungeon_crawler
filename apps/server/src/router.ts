import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { authRouter } from './features/auth/auth.router';
import { userRouter } from './features/user/user.router';
import { gameRouter } from './features/game/game.router';

const s = initServer();

export const router = s.router(contract, {
  auth: authRouter,
  user: userRouter,
  game: gameRouter
});
