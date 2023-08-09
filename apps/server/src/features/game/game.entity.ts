import { UUID } from '@dungeon-crawler/contract';
import { User } from '../user/user.entity';

export type GameId = UUID;

export type Game = {
  id: GameId;
  name: string;
  createdAt: Date;
  author: User;
  capacity: number;
  players: User[];
};
