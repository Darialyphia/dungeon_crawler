import { Nullable, Point } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';
import { ECSEntityId } from '../ecs/ECSEntity';

export const attacker = defineECSComponent<
  'attacker',
  { target: Nullable<Point>; struckTargets: ECSEntityId[] },
  true
>('attacker', () => ({ struckTargets: [], target: null }));

export type Attacker = inferComponent<typeof attacker>;

export const attackable = defineECSComponent<'attackable', true>(
  'attackable',
  () => true
);
export type Attackable = inferComponent<typeof attackable>;
