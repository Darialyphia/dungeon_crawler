import { moveEvent } from './move';

export const eventMap = {
  move: moveEvent
} as const;

export type EventMap = typeof eventMap;
export type EventName = keyof EventMap;
