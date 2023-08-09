import { GameState, createGameState } from './gameState';
import { createEmitter } from './emitter';
import { EventMap, inferEventInput } from './events';
import { TICK_RATE } from './constants';
import { BBox, bbox } from './features/physics/physics.components';
import { ECSEntity, ECSEntityId } from './features/ecs/ECSEntity';
import { Player, player } from './features/player/player.components';

export type { EventMap };
export type SerializedGameState = {
  map: GameState['map'];
  players: Record<ECSEntityId, ECSEntity & BBox & Player>;
  timestamp: number;
};
export type DispatchFunction = <T extends keyof EventMap>(
  type: T,
  payload: inferEventInput<T>
) => void;

export type GameEngine = {
  dispatch: DispatchFunction;
  subscribe: (cb: (state: SerializedGameState) => void) => () => void;
  start: () => void;
  stop: () => void;
};

export type GameFactory = (opts: { debug?: boolean }) => GameEngine;

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
  const eventQueue: Set<{ type: keyof EventMap; payload: any }> = new Set();

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

    eventQueue.forEach(event => {
      emitter.emit(event.type, event.payload);
    });
    eventQueue.clear();

    state.world.runSystems({ delta });

    lastTick = now;
    emitter.emit('tick', state);

    const elapsed = performance.now() - now;
    if (elapsed > tickDuration) {
      perfWarning(elapsed);
    }
  };

  const serializeState = (state: GameState): SerializedGameState => {
    const players = player.findAll<[BBox]>(state.world, [bbox.brand]);

    return {
      timestamp: Date.now(),
      map: state.map,
      players: Object.fromEntries(players.map(e => [e.entity_id, e]))
    };
  };

  return {
    dispatch(type, payload) {
      eventQueue.add({ type, payload });
    },

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
