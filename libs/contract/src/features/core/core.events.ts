import type { UserResponse } from '../user/user.schemas';
import type { UUID } from './core.types';

export type IoEvents = {
  CLIENT: {
    JOIN_ROOM(roomId: UUID): void;
    LEAVE_ROOM(roomId: UUID): void;
  };
  SERVER: {
    USER_JOINED_ROOM(payload: { user: UserResponse; roomId: string }): void;
    USER_LEFT_ARENA(payload: { user: UserResponse; roomId: string }): void;
  };
};
