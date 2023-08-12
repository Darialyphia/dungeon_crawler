import { HEIGHT, SEED, WIDTH } from './constants';
import { ECSWorld, createWorld } from './features/ecs/ECSWorld';
import { createNoiseGenerator } from './features/map/generators/noise';
import { CELL_TYPES, GameMap, createGameMap } from './features/map/map.factory';
import { physicsSystem } from './features/physics/physics.system';

export type GameState = {
  isRunning: boolean;
  world: ECSWorld;
  map: GameMap;
};

export const createGameState = (): GameState => {
  const state: GameState = {
    isRunning: false,
    map: createGameMap({
      width: WIDTH,
      height: HEIGHT,
      generator: createNoiseGenerator({
        seed: SEED,
        scale({ x, y, value }) {
          if (value < 0.05) {
            return { x, y, type: CELL_TYPES.WATER };
          }
          if (value > 0.8) {
            return { x, y, type: CELL_TYPES.WALL };
          }
          return { x, y, type: CELL_TYPES.GROUND };
        }
      })
    }),
    world: createWorld()
  };

  state.world.addSystem('physics', physicsSystem(state));
  return state;
};
