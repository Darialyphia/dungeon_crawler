import {
  Point,
  addVector,
  clamp,
  dist,
  lineRectIntersectionPoints,
  setMagnitude
} from '@dungeon-crawler/shared';
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
import { CELL_TYPES } from '../map/map.factory';
import { min } from 'fp-ts/lib/ReadonlyNonEmptyArray';

const minkowskiSum = (box1: BBoxProps, box2: BBoxProps): BBoxProps => {
  return rectToBBox({
    x: box2.x,
    y: box2.y,
    width: (box1.width + box2.width) * 0.95,
    height: (box1.height + box2.height) * 0.95
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
            maxX: Math.max(e.bbox.minX, newBbox.minX),
            maxY: Math.max(e.bbox.minY, newBbox.minY)
          });

          const clampToMap = ({ x, y }: Point) => {
            Object.assign(e.bbox, {
              x: clamp(x, e.bbox.width / 2, map.width - e.bbox.width / 2),
              y: clamp(y, e.bbox.height / 2, map.height - e.bbox.height / 2)
            });
          };

          result.forEach(bbox => {
            if (bbox === e.bbox) return;

            const minkowskiRectangle = minkowskiSum(e.bbox, bbox);
            const intersectionPoints = lineRectIntersectionPoints(
              {
                start: { x: e.bbox.x, y: e.bbox.y },
                end: { x: newBbox.x, y: newBbox.y }
              },
              minkowskiRectangle
            );
            console.log(intersectionPoints.length);
            switch (intersectionPoints.length) {
              case 1:
                newBbox = rectToBBox({
                  ...intersectionPoints[0],
                  width: e.bbox.width,
                  height: e.bbox.height
                });

                break;
              case 2:
                const closest = intersectionPoints.reduce((acc, current) => {
                  const dAcc = dist(e.bbox, acc);
                  const dCurr = dist(e.bbox, current);
                  return dAcc < dCurr ? acc : current;
                });
                newBbox = rectToBBox({
                  ...closest,
                  width: e.bbox.width,
                  height: e.bbox.height
                });
                break;
              default:
                break;
            }
          });

          clampToMap(newBbox);
        }
      });
    }
  };
};
