import { addVector, setMagnitude } from '@dungeon-crawler/shared';
import { ECSSystem } from '../ecs/ECSSystem';
import { BBox, Velocity, bbox, velocity } from './physics.components';

export const physicsSystem = (): ECSSystem<[BBox, Velocity]> => {
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
        Object.assign(e.bbox, newPosition);
      });
    }
  };
};
