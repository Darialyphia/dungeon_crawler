import { addVector, clamp, setMagnitude } from '@dungeon-crawler/shared';
import { ECSSystem } from '../ecs/ECSSystem';
import {
  BBox,
  BBoxProps,
  Velocity,
  bbox,
  rectToBBox,
  velocity
} from './physics.components';
import { GameState } from '../../gameState';

const minkowskiSum = (box1: BBoxProps, box2: BBoxProps): BBoxProps => {
  return rectToBBox({
    x: box2.x,
    y: box2.y,
    width: box1.width + box2.width,
    height: box1.height + box2.height
  });
};

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
          x: clamp(
            newPosition.x,
            e.bbox.width / 2,
            map.width - e.bbox.width / 2
          ),
          y: clamp(
            newPosition.y,
            e.bbox.height / 2,
            map.height - e.bbox.height / 2
          )
        });
      });
    }
  };
};
