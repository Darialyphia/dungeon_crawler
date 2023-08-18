import { Spritesheet } from 'pixi.js';
import type { MapCell } from '@dungeon-crawler/game-engine';

// see http://www.cr31.co.uk/stagecast/wang/blob.html
const BITMASK_TO_INDEX_DICT = {
  0: 0,
  4: 1,
  92: 2,
  124: 3,
  116: 4,
  80: 5,
  // no index 6: tile not used
  16: 7,
  20: 8,
  87: 9,
  223: 10,
  241: 11,
  21: 12,
  64: 13,
  29: 14,
  117: 15,
  85: 16,
  71: 17,
  221: 18,
  125: 19,
  112: 20,
  31: 21,
  253: 22,
  113: 23,
  28: 24,
  127: 25,
  247: 26,
  209: 27,
  23: 28,
  199: 29,
  213: 30,
  95: 31,
  255: 32,
  245: 33,
  81: 34,
  5: 35,
  84: 36,
  93: 37,
  119: 38,
  215: 39,
  193: 40,
  17: 41,
  // no index 42: tile not used
  1: 43,
  7: 44,
  197: 45,
  69: 46,
  68: 47,
  65: 48
} as const;

const TEXTURES_PER_CELL_TYPE = 49;

export const useMapTextureBuilder = (spritesheet: Spritesheet) => {
  const textures = Object.values(spritesheet.textures);

  return {
    // getTextureFor,
    getBitmaskTexture(cell: MapCell) {
      const bitMaskIndex =
        BITMASK_TO_INDEX_DICT[cell.bitMask as keyof typeof BITMASK_TO_INDEX_DICT];

      const index = cell.type * TEXTURES_PER_CELL_TYPE + bitMaskIndex;

      const texture = textures[index];
      if (!texture) {
        console.log(cell, index, textures.length);
      }
      return texture;
    }
  };
};
