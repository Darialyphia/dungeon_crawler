import { ExtensionType, LoaderParserPriority, Texture } from "pixi.js";
import { z } from "zod";
import { trimExtension } from "./helpers";

import baseTileset from "@dungeon-crawler/resources/src/tilesets/base/base-tileset.json?url";

import testSprite from "@dungeon-crawler/resources/src/sprites/test.json?url";

const asepriteSizeSchema = z.object({
  w: z.number(),
  h: z.number(),
});
const asepriteRectSchema = asepriteSizeSchema.extend({
  x: z.number(),
  y: z.number(),
});

const asepriteJsonSchema = z.object({
  frames: z
    .object({
      filename: z.string(),
      frame: asepriteRectSchema,
      spriteSourceSize: asepriteRectSchema,
      duration: z.number().optional(),
    })
    .array(),
  meta: z.object({
    image: z.string(),
    size: asepriteSizeSchema,
    scale: z.string(),
    frameTags: z
      .object({
        name: z.string(),
        from: z.number(),
        to: z.number(),
        direction: z.string(),
      })
      .array(),
  }),
});
type AsepriteJson = z.infer<typeof asepriteJsonSchema>;

const tilesetsUrls = [baseTileset];
const spritesUrls = [testSprite];

const isTileset = (url: string) =>
  !!tilesetsUrls.find((path) => url.includes(path));
const isSprite = (url: string) =>
  !!spritesUrls.find((path) => url.includes(path));

const parseTileset = ({ frames, meta }: AsepriteJson) => ({
  frames: Object.fromEntries(
    frames.map((frame, index) => {
      const frameName = `${trimExtension(meta.image)}-${index}`;
      // avoids console warnings with HMR
      if (import.meta.env.DEV) {
        Texture.removeFromCache(frameName);
      }

      return [frameName, frame];
    })
  ),
  meta,
});

const parseSprite = ({ frames, meta }: AsepriteJson) => {
  return {
    frames: Object.fromEntries(
      frames.map((frame) => {
        const { filename } = frame;
        // avoids console warnings with HMR
        if (import.meta.env.DEV) {
          Texture.removeFromCache(filename);
        }
        return [filename, frame];
      })
    ),
    animations: Object.fromEntries(
      meta.frameTags.map((tag) => [
        tag.name,
        frames.slice(tag.from, tag.to + 1).map((frame) => frame.filename),
      ])
    ),
    meta: {
      ...meta,
      scale: "1",
    },
  };
};

export const spriteSheetParser = {
  extension: {
    name: "Howler Loader Parser",
    priority: LoaderParserPriority.Normal,
    type: ExtensionType.LoadParser,
  },
  test(url: string): boolean {
    return isTileset(url) || isSprite(url);
  },
  async load(url: string) {
    const response = await fetch(url);
    const json = await response.json();

    const parsed = asepriteJsonSchema.parse(json);

    if (isTileset(url)) return parseTileset(parsed);
    if (isSprite(url)) return parseSprite(parsed);
  },
};
