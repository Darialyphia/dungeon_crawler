import {
  Point,
  addVector,
  clamp,
  dist,
  lineRectIntersection,
  setMagnitude
} from '@dungeon-crawler/shared';
import { ECSSystem } from '../ecs/ECSSystem';
import {
  BBox,
  BBoxProps,
  Velocity,
  bbox,
  rectToBBox,
  updatePosition,
  velocity
} from './physics.components';
import * as O from 'fp-ts/Option';
import { GameState } from '../../gameState';
import {} from '../ecs/ECSEntity';

export const physicsSystem = ({ map, tree }: GameState): ECSSystem<[BBox, Velocity]> => {
  const computeNewPosition = (e: BBox & Velocity, delta: number) =>
    addVector(e.bbox, setMagnitude(e.velocity.target, (e.velocity.speed * delta) / 1000));

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

  const clampToMapEdges = (bbox: BBoxProps, { x, y }: Point) => {
    return updatePosition(bbox, {
      x: clamp(x, bbox.width / 2, map.width - bbox.width / 2),
      y: clamp(y, bbox.height / 2, map.height - bbox.height / 2)
    });
  };

  // get the collidables in the rectangle around the old and now position
  const getCollidables = (oldBbox: BBoxProps, newBbox: BBoxProps) =>
    tree.search({
      minX: Math.min(oldBbox.minX, newBbox.minX),
      minY: Math.min(oldBbox.minY, newBbox.minY),
      maxX: Math.max(oldBbox.maxX, newBbox.maxX),
      maxY: Math.max(oldBbox.maxY, newBbox.maxY)
    });

  const getClosestIntersection = ({
    oldBbox,
    newBbox,
    collidable,
    coefficient
  }: {
    oldBbox: BBoxProps;
    newBbox: BBoxProps;
    collidable: BBoxProps;
    coefficient: number;
  }): O.Option<Point> => {
    const minkowskiRectangle = minkowskiSum(oldBbox, collidable, coefficient);
    const intersection = lineRectIntersection(
      {
        start: { x: oldBbox.x, y: oldBbox.y },
        end: { x: newBbox.x, y: newBbox.y }
      },
      minkowskiRectangle
    );

    if (!intersection.length) return O.none;

    const closest = intersection.reduce((acc, current) =>
      dist(oldBbox, acc) < dist(oldBbox, current) ? acc : current
    );

    return O.some(closest);
  };

  return {
    target: [bbox.brand, velocity.brand],
    run(_, props, entities) {
      entities.forEach(e => {
        if (!velocity.has(e)) return;

        const newPos = computeNewPosition(e, props.delta);
        let newBbox = clampToMapEdges(e.bbox, newPos);

        const collidables = getCollidables(e.bbox, newBbox);

        collidables.forEach(collidable => {
          if (collidable.entity_id === e.entity_id) return;

          const closest = getClosestIntersection({
            oldBbox: e.bbox,
            newBbox,
            collidable: collidable.bbox,
            coefficient: 0.9
          });

          if (O.isNone(closest)) return;
          // has a very sùamm offset, otherwise on the next tick the entity will still be colliding and get stuck
          const withOffset = (a: number, b: number) =>
            a + (a < b ? 1 / 100 : a > b ? -1 / 100 : 0);

          // newBbox = clampToMapEdges(e.bbox, {
          //   x: withOffset(closest.value.x, e.bbox.x),
          //   y: withOffset(closest.value.y, e.bbox.y)
          // });
        });

        e.bbox = newBbox;
      });
    }
  };
};
