/**
 * Interactive component
 */

import { Nullable } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../../utils';
import { ECSEntityId } from '../ecs/ECSEntity';

export const interactive = defineECSComponent<
  'interactive',
  { isEnabled: boolean; activationRange: number; interactedBy: ECSEntityId[] },
  { isEnabled: boolean; activationRange: number }
>('interactive', state => ({ ...state, interactedBy: [] }));

export type Interactive = inferComponent<typeof interactive>;
