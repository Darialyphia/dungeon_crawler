import { moveEvent } from './move';
import { playerJoinEvent } from './player-join';
import { playerLeaveEvent } from './player-leave';

export const eventMap = {
  move: moveEvent,
  join: playerJoinEvent,
  leave: playerLeaveEvent
} as const;

export type EventMap = typeof eventMap;
export type EventName = keyof EventMap;
