import mitt from 'mitt';
import { GameState } from './gameState';
import { EventMap, EventName, eventMap } from './events';
import { AnyZodObject, z } from 'zod';

export type GameEventHandler<T extends AnyZodObject> = {
  input: T;
  handler: (arg: { input: z.infer<T>; state: GameState }) => void;
};

export type Events = EventMap & {
  tick: GameState;
};

export type Emitter = ReturnType<typeof createEmitter>;

export const createEmitter = (state: GameState) => {
  const emitter = mitt<Events>();

  emitter.on('*', (event, payload) => {
    const handler = eventMap[event as keyof EventMap];
    if (!handler) return;

    const validatedInput = handler.input.safeParse(payload);

    if (!validatedInput.success) return;

    handler.handler({
      state,
      input: validatedInput.data as any
    });
  });

  return emitter;
};
