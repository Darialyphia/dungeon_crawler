import { mapRange } from '@dungeon-crawler/shared';
import { HEIGHT, SEED, WIDTH } from './constants';
import { ECSWorld, createWorld } from './features/ecs/ECSWorld';
import { createNoiseGenerator } from './features/map/generators/noise';
import { CELL_TYPES, GameMap, createGameMap } from './features/map/map.factory';
import { physicsSystem } from './features/physics/physics.system';
import RBush from 'rbush';
import { BBox, BBoxProps } from './features/physics/physics.components';

export type GameState = {
  isRunning: boolean;
  world: ECSWorld;
  map: GameMap;
  tree: RBush<BBox>;
};

class MyRBush extends RBush<BBox> {
  toBBox(e: BBox) {
    return e.bbox;
  }
  compareMinX(a: BBox, b: BBox) {
    return a.bbox.minX - b.bbox.minX;
  }
  compareMinY(a: BBox, b: BBox) {
    return a.bbox.minY - b.bbox.minY;
  }
}

export const createGameState = (): GameState => {
  const state: GameState = {
    isRunning: false,
    tree: new MyRBush(),
    map: createGameMap({
      width: WIDTH,
      height: HEIGHT,
      tileset: 'base',
      generator: createNoiseGenerator({
        seed: SEED,
        scale({ x, y, value }) {
          const normalized = mapRange(value, [-1, 1], [0, 1]);
          if (normalized < 0.005) {
            return { x, y, type: CELL_TYPES.WATER };
          }
          if (normalized > 0.7) {
            return { x, y, type: CELL_TYPES.WALL };
          }
          return { x, y, type: CELL_TYPES.GROUND };
        }
      })
    }),
    world: createWorld()
  };

  state.map.init(state);
  state.world.addSystem('physics', physicsSystem(state));

  return state;
};
