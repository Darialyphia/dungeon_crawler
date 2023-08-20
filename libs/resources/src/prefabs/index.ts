import { Size } from '@dungeon-crawler/shared';

type Prefab = Size & { sprite: string };

export const prefabs = {
  base: {
    bush01: {
      width: 0.5,
      height: 0.5,
      sprite: 'bush01'
    },
    bush02: {
      width: 0.5,
      height: 0.75,
      sprite: 'bush02'
    },
    rock01: {
      width: 0.5,
      height: 0.5,
      sprite: 'rock01'
    },
    rock02: {
      width: 1,
      height: 1,
      sprite: 'rock02'
    },
    rock03: {
      width: 0.5,
      height: 0.5,
      sprite: 'rock03'
    }
  }
} satisfies Record<string, Record<string, Prefab>>;
