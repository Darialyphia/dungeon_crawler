import { z } from 'zod';
import { UserResponse } from '../user';
import { MAX_USERS_PER_LOBBY } from './lobby.constants';

export const LobbyResponse = z.object({
  id: z.string().cuid(),
  name: z.string().min(4).nullable(),
  author: UserResponse,
  createdAt: z.coerce.date(),
  capacity: z.number().min(1).max(MAX_USERS_PER_LOBBY),
  participants: UserResponse.array()
});

export type LobbyResponse = z.infer<typeof LobbyResponse>;
