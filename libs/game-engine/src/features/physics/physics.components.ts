import { Point, Rectangle } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';

export const bbox = defineECSComponent<'bbox', Rectangle>('bbox');
export type BBox = inferComponent<typeof bbox>;

export const velocity = defineECSComponent<
  'velocity',
  { target: Point; speed: number }
>('velocity');
export type Velocity = inferComponent<typeof velocity>;
