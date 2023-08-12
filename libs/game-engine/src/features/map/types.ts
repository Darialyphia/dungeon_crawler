import type { Point } from '@dungeon-crawler/shared';

export type MapGenerator<T> = {
  getChunk(opts: { width: number; height: number; startsAt: Point }): T[];
};
