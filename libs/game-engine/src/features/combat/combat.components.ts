import { defineECSComponent, inferComponent } from '../../utils';

export const attacker = defineECSComponent<
  'attacker',
  { attackStartedAt: number | null },
  true
>('attacker', () => ({ attackStartedAt: null }));

export type Attacker = inferComponent<typeof attacker>;
