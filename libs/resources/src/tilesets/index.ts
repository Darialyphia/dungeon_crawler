import placeholder from './placeholder/placeholder.json';
import { ITiledMapTileset } from '@workadventure/tiled-map-type-guard';

export const tilesets = {
  placeholder: placeholder as ITiledMapTileset
} as const;

export type TilesetId = keyof typeof tilesets;
