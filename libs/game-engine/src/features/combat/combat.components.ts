import { Nullable, Point } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';

export const attacker = defineECSComponent<
  'attacker',
  { attackStartedAt: Nullable<number>; target: Nullable<Point> },
  true
>('attacker', () => ({ attackStartedAt: null, target: null }));

export type Attacker = inferComponent<typeof attacker>;
