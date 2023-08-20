import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

/**
 * MonsterState component
 */

type MonsterStateType = 'idle' | 'walking';

export const monsterState = defineECSComponent<
  'monsterState',
  { state: MonsterStateType },
  MonsterStateType
>('monsterState', state => ({ state }));

export type MonsterState = inferComponent<typeof monsterState>;
