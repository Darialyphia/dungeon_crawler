import { knight } from './knight';

export type Character = {
  attack: {
    kind: 'melee' | 'ranged';
    shape: 'arc';
    range: number;
    angle: number;
  };
};
export const characters = { knight } satisfies Record<string, Character>;
