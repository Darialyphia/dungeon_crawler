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
      width: 50,
      height: 50
    },
    world: createWorld()
  };

  state.world.addSystem('physics', physicsSystem(state));
  return state;
};
