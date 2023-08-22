import { sprites } from '@dungeon-crawler/resources/src/sprites';
import { defineECSComponent, inferComponent } from '../../utils';

export const spritable = defineECSComponent<
  'spritable',
  { sprite: keyof typeof sprites }
>('spritable', x => x);

export type Spritable = inferComponent<typeof spritable>;

/**
 * PlayerState component
 */

type AnimationState = 'idle' | 'walking' | 'attacking';

export const animatable = defineECSComponent<'animatable', { state: AnimationState }>(
  'animatable',
  state => state
);

export type Animatable = inferComponent<typeof animatable>;
