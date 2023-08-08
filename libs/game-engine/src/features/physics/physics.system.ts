import { addVector, clamp, setMagnitude } from '@dungeon-crawler/shared';
import { ECSSystem } from '../ecs/ECSSystem';
import { BBox, Velocity, bbox, velocity } from './physics.components';
import { GameState } from '../../gameState';

export const physicsSystem = ({
  map
}: GameState): ECSSystem<[BBox, Velocity]> => {
  return {
    target: [bbox.brand, velocity.brand],
    run(world, props, entities) {
      entities.forEach(e => {
        const newPosition = addVector(
          e.bbox,
          setMagnitude(
            e.velocity.target,
            (e.velocity.speed * props.delta) / 1000
          )
        );

        Object.assign(e.bbox, {
          x: clamp(newPosition.x, e.bbox.w / 2, map.width - e.bbox.w / 2),
          y: clamp(newPosition.y, e.bbox.h / 2, map.height - e.bbox.h / 2)
        });
      });
    }
  };
};
