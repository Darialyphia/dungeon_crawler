import { sprites } from '@dungeon-crawler/resources/src/sprites';
import { defineECSComponent, inferComponent } from '../../utils';

/**
 * Spritable component
 */
export const spritable = defineECSComponent<
  'spritable',
  { sprite: keyof typeof sprites }
>('spritable', x => x);

export type Spritable = inferComponent<typeof spritable>;

/**
 * AnimationState component
 */
type AnimationState = 'idle' | 'walking' | 'attacking' | 'hit';

export const animatable = defineECSComponent<
  'animatable',
  { state: AnimationState; lastChangedAt: number },
  { state: AnimationState }
>('animatable', ({ state }) => ({ state, lastChangedAt: 0 }));

export type Animatable = inferComponent<typeof animatable>;
