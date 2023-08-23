import { Nullable, Point } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';

export const attacker = defineECSComponent<'attacker', { target: Nullable<Point> }, true>(
  'attacker',
  () => ({ attackStartedAt: null, target: null })
);

export type Attacker = inferComponent<typeof attacker>;

export const attackable = defineECSComponent<'attackable', true>(
  'attackable',
  () => true
);
export type Attackable = inferComponent<typeof attackable>;
