import { ECSWorld, createWorld } from './features/ecs/ECSWorld';
import { physicsSystem } from './features/physics/physics.system';

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
    world: createWorld().addSystem('physics', physicsSystem())
  };

  return state;
};
