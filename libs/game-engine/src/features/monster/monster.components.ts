import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

export const monster = defineECSComponent<'monster', true>('monster', x => x);
export type Monster = inferComponent<typeof monster>;
