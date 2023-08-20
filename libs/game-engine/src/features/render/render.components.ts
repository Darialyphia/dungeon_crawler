import { defineECSComponent, inferComponent } from '../../utils';

export const spritable = defineECSComponent<'spritable', { sprite: string }>(
  'spritable',
  x => x
);

export type Spritable = inferComponent<typeof spritable>;
