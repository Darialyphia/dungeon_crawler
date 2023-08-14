import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

export const obstacle = defineECSComponent<
  'obstacle',
  { isWall: boolean; isWater: boolean }
>('obstacle', x => x);
export type Obstacle = inferComponent<typeof obstacle>;
