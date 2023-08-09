import { z } from 'zod';
import { UserResponse } from '../user';
import { MAX_USERS_PER_GAME } from './game.constants';

export const GameResponse = z.object({
  id: z.string().cuid(),
  name: z.string().min(4).nullable(),
  author: UserResponse,
  createdAt: z.coerce.date(),
  capacity: z.number().min(1).max(MAX_USERS_PER_GAME),
  players: UserResponse.array()
});

export type GameResponse = z.infer<typeof GameResponse>;
