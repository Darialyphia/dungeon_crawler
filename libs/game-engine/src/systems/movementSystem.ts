import { player } from '../components/player';
import { Position, position } from '../components/position';
import { ECSSystem } from '../ecs/ECSSystem';

export const movementSystem: ECSSystem<[Position]> = {
  target: [position.brand],
  run: (world, props, entities) => {}
};
