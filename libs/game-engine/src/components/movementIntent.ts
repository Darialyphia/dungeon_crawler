import { Point } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../utils';

export const movementIntent = defineECSComponent<'movementIntent', Point>(
  'movementIntent'
);
export type MovementIntent = inferComponent<typeof movementIntent>;
