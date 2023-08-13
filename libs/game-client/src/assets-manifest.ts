import baseTileset from "@dungeon-crawler/resources/src/tilesets/base/base-tileset.json?url";
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
  ],
};
