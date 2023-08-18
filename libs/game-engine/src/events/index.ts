import { z } from 'zod';
import { moveEvent } from './move';
import { playerJoinEvent } from './player-join';
import { playerLeaveEvent } from './player-leave';
import { interactEvent } from './interact';

export const eventMap = {
  move: moveEvent,
  join: playerJoinEvent,
  leave: playerLeaveEvent,
  interact: interactEvent
} as const;

export type EventMap = typeof eventMap;
export type EventName = keyof EventMap;
export type inferEventInput<T extends EventName> = z.infer<EventMap[T]['input']>;
