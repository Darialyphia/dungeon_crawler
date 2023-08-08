import { GameState, createGameState } from './gameState';
import { createEmitter } from './emitter';
import { EventMap, inferEventInput } from './events';
import { TICK_RATE } from './constants';
import { BBox, bbox } from './features/physics/physics.components';

export type { EventMap };
export type SerializedGameState = {
  map: GameState['map'];
  entities: BBox[];
};

export type Game = {
  dispatch: <T extends keyof EventMap>(
    type: T,
    payload: inferEventInput<T>
  ) => void;
  subscribe: (cb: (state: SerializedGameState) => void) => () => void;
  start: () => void;
  stop: () => void;
};

export type GameFactory = (opts: { debug?: boolean }) => Game;

const tickDuration = 1000 / TICK_RATE;
const perfWarning = (elapsed: number) => {
  console.log(
    `tick duration over performance budget by ${(
      elapsed - tickDuration
    ).toFixed(1)}ms`
  );
};

export const createGame: GameFactory = ({ debug = false }) => {
  const state = createGameState();
  const emitter = createEmitter(state);

  if (debug) {
    emitter.on('*', (e, payload) => {
      if (e === 'tick') return;
      console.log(e, payload);
    });
  }
  let interval: ReturnType<typeof setInterval> | null;
  let lastTick = performance.now();

  const tick = () => {
    const now = performance.now();

    const delta = now - lastTick;
    state.world.runSystems({ delta });

    emitter.emit('tick', state);
    lastTick = now;

    const elapsed = performance.now() - now;
    if (elapsed > tickDuration) {
      perfWarning(elapsed);
    }
  };

  const serializeState = (state: GameState): SerializedGameState => {
    return {
      map: state.map,
      entities: bbox.findAll(state.world)
    };
  };

  return {
    dispatch: emitter.emit,

    subscribe(cb) {
      const _cb = (state: GameState) => {
        cb(serializeState(state));
      };
      emitter.on('tick', _cb);

      return () => {
        emitter.off('tick', _cb);
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
