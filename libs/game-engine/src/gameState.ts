import { ECSWorld, createWorld } from './ecs/ECSWorld';

export type GameState = {
  isRunning: boolean;
  world: ECSWorld;
  map: { width: number; height: number };
};

export const createGameState = (): GameState => {
  const state: GameState = {
    isRunning: false,
    map: {
      width: 100,
      height: 100
    },
    world: createWorld()
  };

  return state;
};
