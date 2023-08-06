import { GameState, createGameState } from './gameState';
import { createEmitter } from './emitter';
import { EventMap } from './events';
import { z } from 'zod';
import { TICK_RATE } from './constants';

export type Game = {
  dispatch: <T extends keyof EventMap>(
    type: T,
    payload: z.infer<EventMap[T]['input']>
  ) => void;
  subscribe: (cb: (state: GameState) => void) => () => void;
  start: () => void;
  stop: () => void;
};

export type GameFactory = () => Game;

const tickDuration = 1000 / TICK_RATE;
const perfWarning = (elapsed: number) => {
  console.log(
    `tick duration over performance budget by ${(
      elapsed - tickDuration
    ).toFixed(1)}ms`
  );
};

export const createGame: GameFactory = () => {
  const state = createGameState();
  const emitter = createEmitter(state);

  let interval: ReturnType<typeof setInterval> | null;

  const tick = () => {
    const now = performance.now();

    // TODO Gameloop

    emitter.emit('tick', state);

    const elapsed = performance.now() - now;
    if (elapsed > tickDuration) {
      perfWarning(elapsed);
    }
  };

  return {
    dispatch: emitter.emit,

    subscribe(cb) {
      emitter.on('tick', cb);

      return () => {
        emitter.off('tick', cb);
      };
    },

    start() {
      if (state.isRunning) return;
      interval = setInterval(tick, tickDuration);
    },

    stop() {
      if (!interval) return;
      clearInterval(interval);
      interval = null;
      state.isRunning = false;
    }
  };
};
