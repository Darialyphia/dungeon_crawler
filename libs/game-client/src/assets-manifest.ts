import { assetsUrls } from '@dungeon-crawler/resources/src/browser';
import { ResolverManifest } from 'pixi.js';
import { Values } from '@dungeon-crawler/shared';

export const BUNDLES = {
  TILESETS: 'tilesets',
  SPRITES: 'sprites'
} as const;

export type AssetBundle = Values<typeof BUNDLES>;

export const assetsManifest: ResolverManifest = {
  bundles: [
    {
      name: BUNDLES.TILESETS,
      assets: Object.entries(assetsUrls.tilesets).map(([name, srcs]) => ({
        name,
        srcs
      }))
    },
    {
      name: BUNDLES.SPRITES,
      assets: Object.entries(assetsUrls.sprites).map(([name, srcs]) => ({
        name,
        srcs
      }))
    }
  ]
};
