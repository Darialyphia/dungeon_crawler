import { assetsUrls } from '@dungeon-crawler/resources/src/browser';
import { ResolverManifest } from 'pixi.js';
import { Values, objectEntries } from '@dungeon-crawler/shared';

export const ASSET_BUNDLES = {
  TILESETS: 'tilesets',
  SPRITES: 'sprites',
  PREFABS: 'prefabs'
} as const;

export type AssetBundle = Values<typeof ASSET_BUNDLES>;

export const assetsManifest = {
  bundles: [
    {
      name: ASSET_BUNDLES.TILESETS,
      assets: objectEntries(assetsUrls.tilesets).map(([name, srcs]) => ({
        name,
        srcs
      }))
    },
    {
      name: ASSET_BUNDLES.SPRITES,
      assets: objectEntries(assetsUrls.sprites).map(([name, srcs]) => ({
        name,
        srcs
      }))
    },
    {
      name: ASSET_BUNDLES.PREFABS,
      assets: objectEntries(assetsUrls.prefabs).map(([name, srcs]) => ({
        name,
        srcs
      }))
    }
  ]
} satisfies ResolverManifest;
