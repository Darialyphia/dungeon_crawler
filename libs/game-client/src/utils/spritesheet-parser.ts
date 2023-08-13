import { ExtensionType, LoaderParserPriority } from "pixi.js";
import baseTileset from "@dungeon-crawler/resources/src/tilesets/base/base-tileset.json?url";
import { z } from "zod";
import { trimExtension } from "./helpers";

const asepriteSizeSchema = z.object({
  w: z.number(),
  h: z.number(),
});
const asepriteRectSchema = asepriteSizeSchema.extend({
  x: z.number(),
  y: z.number(),
});

const asepriteTilesetSchema = z.object({
  frames: z
    .object({
      filename: z.string(),
      frame: asepriteRectSchema,
      spriteSourceSize: asepriteRectSchema,
    })
    .array(),
  meta: z.object({
    image: z.string(),
    size: asepriteSizeSchema,
    scale: z.string(),
  }),
});

const tilesetUrls = [baseTileset];

export const spriteSheetParser = {
  extension: {
    name: "Howler Loader Parser",
    priority: LoaderParserPriority.Normal,
    type: ExtensionType.LoadParser,
  },
  test(url: string): boolean {
    return !!tilesetUrls.find((path) => url.includes(path));
  },
  async load(url: string) {
    const response = await fetch(url);
    const json = await response.json();

    const { frames, meta } = asepriteTilesetSchema.parse(json);

    return {
      frames: Object.fromEntries(
        frames.map((frame, index) => [
          `${trimExtension(meta.image)}-${index}`,
          frame,
        ])
      ),
      meta,
    };
  },
};
