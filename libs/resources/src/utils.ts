type AsepriteRectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type AsepriteSize = { w: number; h: number };

export interface AsepriteSheet {
  frames: FrameElement[];
  meta: Meta;
}

export interface FrameElement {
  filename: string;
  frame: AsepriteRectangle;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: AsepriteRectangle;
  sourceSize: AsepriteSize;
  duration: number;
}

export interface Meta {
  app: string;
  version: string;
  image: string;
  format: string;
  size: AsepriteSize;
  scale: string;
  frameTags: FrameTag[];
  layers: Layer[];
  slices: Slice[];
}

export interface FrameTag {
  name: string;
  from: number;
  to: number;
  direction: string;
}

export interface Layer {
  name: string;
  opacity: number;
  blendMode: string;
}

export interface Slice {
  name: string;
  color: string;
  keys: SliceKey[];
}

export interface SliceKey {
  frame: number;
  bounds: AsepriteRectangle;
}

export interface AsepriteSheet {
  frames: FrameElement[];
  meta: Meta;
}

export interface FrameElement {
  filename: string;
  frame: AsepriteRectangle;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: AsepriteRectangle;
  sourceSize: AsepriteSize;
  duration: number;
}

export interface Meta {
  app: string;
  version: string;
  image: string;
  format: string;
  size: AsepriteSize;
  scale: string;
  frameTags: FrameTag[];
}

export interface FrameTag {
  name: string;
  from: number;
  to: number;
  direction: string;
}

export const getFramesFromState = (json: AsepriteSheet, state: string) =>
  json.frames
    .filter(frame => frame.filename.startsWith(`knight:${state}`))
    .reduce((total, frame) => total + frame.duration, 0);
