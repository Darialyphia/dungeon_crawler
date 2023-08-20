import { defineECSComponent, inferComponent } from '../../utils';

/**
 * Obstacle component
 */
export const obstacle = defineECSComponent<
  'obstacle',
  { isWall: boolean; isWater: boolean; isRendered: boolean }
>('obstacle', x => x);
export type Obstacle = inferComponent<typeof obstacle>;

/**
 * Portal component
 */
export const portal = defineECSComponent<
  'portal',
  { isEntrance: boolean; isExit: boolean }
>('portal', x => x);
export type Portal = inferComponent<typeof portal>;
