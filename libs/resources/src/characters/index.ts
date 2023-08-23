import { knight } from './knight';
import { orc } from './orc';

export type Character = {
  attack: {
    kind: 'melee' | 'ranged';
    shape: 'arc';
    range: number;
    angle: number;
  };
};
export const characters = { orc, knight } satisfies Record<string, Character>;
