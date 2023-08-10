import type { UserResponse } from '../user/user.schemas';
import type { UUID } from './core.types';
import type { SerializedGameState } from '@dungeon-crawler/game-engine';

export type IoEvents = {
  CLIENT: {
    JOIN_ROOM(roomId: UUID): void;
    LEAVE_ROOM(roomId: UUID): void;
  };
  SERVER: {
    USER_JOINED_ROOM(payload: { user: UserResponse; roomId: string }): void;
    USER_LEFT_ROOM(payload: { user: UserResponse; roomId: string }): void;
    GAME_STATE_UPDATE(payload: { gameId: UUID; state: SerializedGameState }): void;
  };
};
