import { AnyObject } from '@dungeon-crawler/shared';
import { knight } from './knight';
import { AsepriteSheet } from '../utils';

type SpriteAnimation = {
  animationDuration: number;
};

export type DungeonCrawlerSprite = {
  states: {
    walking: SpriteAnimation;
    idle: SpriteAnimation;
    attacking: SpriteAnimation;
  };
};

export const sprites = { knight } satisfies Record<
  string,
  DungeonCrawlerSprite
>;
