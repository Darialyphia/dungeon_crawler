import {
  Point,
  addVector,
  clamp,
  dist,
  lineRectIntersection,
  rectRectCollision,
  setMagnitude
} from '@dungeon-crawler/shared';
import { ECSSystem } from '../ecs/ECSSystem';
import {
  BBox,
  BBoxProps,
  bbox,
  rectToBBox,
  velocity
} from './physics.components';
import { GameState } from '../../gameState';

const minkowskiSum = (
  box1: BBoxProps,
  box2: BBoxProps,
  inflationCoefficient = 1
): BBoxProps => {
  return rectToBBox({
    x: box2.x,
    y: box2.y,
    width: (box1.width + box2.width) * inflationCoefficient,
    height: (box1.height + box2.height) * inflationCoefficient
  });
};

export const physicsSystem = ({ map, tree }: GameState): ECSSystem<[BBox]> => {
  return {
    target: [bbox.brand],
    run(world, props, entities) {
      entities.forEach(e => {
        if (velocity.has(e)) {
          let newBbox = rectToBBox({
            width: e.bbox.width,
            height: e.bbox.height,
            ...addVector(
              e.bbox,
              setMagnitude(
                e.velocity.target,
                (e.velocity.speed * props.delta) / 1000
              )
            )
          });

          const result = tree.search({
            minX: Math.min(e.bbox.minX, newBbox.minX),
            minY: Math.min(e.bbox.minY, newBbox.minY),
            maxX: Math.max(e.bbox.maxX, newBbox.maxX),
            maxY: Math.max(e.bbox.maxY, newBbox.maxY)
          });

          result.forEach(bbox => {
            if (bbox === e.bbox) return;

            const minkowskiRectangle = minkowskiSum(e.bbox, bbox, 0.9);
            const intersection = lineRectIntersection(
              {
                start: { x: e.bbox.x, y: e.bbox.y },
                end: { x: newBbox.x, y: newBbox.y }
              },
              minkowskiRectangle
            );

            if (intersection.length) {
              const closest = intersection.reduce((acc, current) =>
                dist(e.bbox, acc) < dist(e.bbox, current) ? acc : current
              );

              newBbox = rectToBBox({
                x:
                  closest.x +
                  (closest.x < e.bbox.x
                    ? 1 / 100
                    : closest.x > e.bbox.x
                    ? -1 / 100
                    : 0),
                y:
                  closest.y +
                  (closest.y < e.bbox.y
                    ? 1 / 10
                    : closest.y > e.bbox.y
                    ? -1 / 10
                    : 0),
                width: e.bbox.width,
                height: e.bbox.height
              });
            }
          });

          e.bbox = rectToBBox({
            x: clamp(newBbox.x, e.bbox.width / 2, map.width - e.bbox.width / 2),
            y: clamp(
              newBbox.y,
              e.bbox.height / 2,
              map.height - e.bbox.height / 2
            ),
            width: e.bbox.width,
            height: e.bbox.height
          });
        }
      });
    }
  };
};
