import { UUID } from '@dungeon-crawler/contract';
import { User } from '../user/user.entity';

export type LobbyId = UUID;

export type Lobby = {
  id: LobbyId;
  name: string;
  createdAt: Date;
  author: User;
  capacity: number;
  participants: User[];
};
