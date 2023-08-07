import { IndexedArray, createIndexedArray } from '@dungeon-crawler/shared';
import { ECSWorld, createWorld } from './ecs/ECSWorld';

export type GameState = {
  isRunning: boolean;
  world: ECSWorld;
};

export const createGameState = (): GameState => {
  const state: GameState = {
    isRunning: false,
    world: createWorld()
  };

  return state;
};
