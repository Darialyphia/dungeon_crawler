import { defineECSComponent, inferComponent } from '../../utils';

export const spritable = defineECSComponent<'spritable', { sprite: string }>(
  'spritable',
  x => x
);

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
