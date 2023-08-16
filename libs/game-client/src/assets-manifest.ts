import baseTileset from "@dungeon-crawler/resources/src/tilesets/base/base-tileset.json?url";
import testSprite from "@dungeon-crawler/resources/src/sprites/orc.json?url";

import { ResolverManifest } from "pixi.js";

export const assetsManifest: ResolverManifest = {
  bundles: [
    {
      name: "base-map",
      assets: [
        {
          name: "base-tileset",
          srcs: baseTileset,
        },
      ],
    },
    {
      name: "sprites",
      assets: [
        {
          name: "test-sprite",
          srcs: testSprite,
        },
      ],
    },
  ],
};
