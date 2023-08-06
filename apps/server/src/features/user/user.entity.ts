import { UUID } from '@dungeon-crawler/contract';

export type UserId = UUID;

export type User = {
  id: UserId;
  email: string;
  name: string | null;
  passwordHash: string;
};
