import { knight } from './knight';
import { orc } from './orc';

type SpriteAnimation = {
  animationDuration: number;
};

export type DungeonCrawlerSprite = {
  states: {
    walking: SpriteAnimation;
    idle: SpriteAnimation;
    attacking: SpriteAnimation;
    hit: SpriteAnimation;
  };
};

export const sprites = { knight, orc } satisfies Record<
  string,
  DungeonCrawlerSprite
>;
