import { Point, Rectangle, Size } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';

/**
 * BBoxComponent
 */

export type BBoxProps = Rectangle & {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const rectToBBox = (rect: Rectangle) => ({
  ...rect,
  minX: rect.x - rect.width / 2,
  maxX: rect.x + rect.width / 2,
  minY: rect.y - rect.height / 2,
  maxY: rect.y + rect.height / 2
});

export const updatePosition = (bbox: BBoxProps, { x, y }: Point): BBoxProps =>
  rectToBBox({
    x,
    y,
    width: bbox.width,
    height: bbox.height
  });

export const updateSize = (
  bbox: BBoxProps,
  { width, height }: Size
): BBoxProps =>
  rectToBBox({
    x: bbox.x,
    y: bbox.y,
    width,
    height
  });

export const bbox = defineECSComponent<'bbox', BBoxProps, Rectangle>(
  'bbox',
  rectToBBox
);
export type BBox = inferComponent<typeof bbox>;

/**
 * Velocity Component
 */

export const velocity = defineECSComponent<
  'velocity',
  { target: Point; speed: number }
>('velocity', vel => vel);

export type Velocity = inferComponent<typeof velocity>;

/**
 * Orientation Component
 */

export type OrientationType = 'left' | 'right';
export const orientation = defineECSComponent<'orientation', OrientationType>(
  'orientation',
  o => o
);

export type Orientation = inferComponent<typeof orientation>;
