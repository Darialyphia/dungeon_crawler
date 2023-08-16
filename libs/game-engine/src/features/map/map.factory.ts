import { Point, randomInt, subVector } from '@dungeon-crawler/shared';
import type { MapGenerator } from './types';
import { WIDTH } from '../../constants';
import { GameState } from '../../gameState';
import { createCell } from './cell.factory';

export const CELL_TYPES = {
  GROUND: 0, // walkable, doesn't block vision and projectiles
  WATER: 1, // not walkable, doesn't block vision or projectiles
  WALL: 2 // not walkable, blocks vision and projectiles
} as const;
export type CellType = 0 | 1 | 2; // GROUND / water / wall

export type Tileset = 'base';

type GeneratedCell = Point & {
  type: CellType;
};
export type MapCell = GeneratedCell & {
  type: CellType;
  bitMask: number;
};

export type SerializedCell = Pick<MapCell, 'type' | 'bitMask'>;

export type MapFactoryOptions = {
  width: number;
  height: number;
  tileset: Tileset;
  generator: MapGenerator<GeneratedCell>;
};

export type GameMap = {
  width: number;
  height: number;
  init(state: GameState): void;
  getValidSpawnPoint(): Point;
  getCellAt(pt: Point): MapCell;
  serialize(): SerializedMap;
};

export type SerializedMap = {
  id: number;
  width: number;
  height: number;
  tileset: Tileset;
  rows: SerializedCell[][];
};
export const MAP_CHUNK_SIZE = WIDTH;

export const createGameMap = ({
  width,
  height,
  tileset,
  generator
}: MapFactoryOptions): GameMap => {
  const chunkCoordsToIndex = ({ x, y }: Point) => MAP_CHUNK_SIZE * y + x;
  const getChunkKey = ({ x, y }: Point) => `${x}:${y}`;

  // map of tile chunks, indexed by their top-left stringified coordinates
  const chunks = new Map<string, MapCell[]>();

  const getBitMask = (cell: GeneratedCell) => {
    return 0;
  };

  const getOrCreateChunk = ({ x, y }: Point) => {
    const key = getChunkKey({ x, y });

    if (!chunks.has(key)) {
      const chunk = generator.getChunk({
        width: x + MAP_CHUNK_SIZE > width ? width - x : MAP_CHUNK_SIZE,
        height: y + MAP_CHUNK_SIZE > height ? height - y : MAP_CHUNK_SIZE,
        startsAt: { x, y }
      });

      chunks.set(
        key,
        chunk.map(cell => ({
          ...cell,
          bitMask: getBitMask(cell)
        }))
      );
    }

    return chunks.get(key)!;
  };

  const map: GameMap = {
    width,
    height,

    init(state) {
      const chunk = getOrCreateChunk({ x: 0, y: 0 });

      chunk.forEach(cell => {
        if (cell.type !== CELL_TYPES.GROUND) {
          createCell(state, cell);
        }
      });
    },

    getCellAt({ x, y }) {
      const topLeft = {
        x: MAP_CHUNK_SIZE * Math.floor(x / MAP_CHUNK_SIZE),
        y: MAP_CHUNK_SIZE * Math.floor(y / MAP_CHUNK_SIZE)
      };

      const chunk = getOrCreateChunk(topLeft);
      const index = chunkCoordsToIndex(subVector({ x, y }, topLeft));

      return chunk[index];
    },

    getValidSpawnPoint() {
      let point = { x: randomInt(width), y: randomInt(height) };
      let cell = map.getCellAt(point);

      while (cell.type !== CELL_TYPES.GROUND) {
        point = { x: randomInt(width), y: randomInt(height) };
        cell = map.getCellAt(point);
      }

      return {
        x: point.x + 0.5,
        y: point.y + 0.5
      };
    },

    serialize() {
      const rows: SerializedCell[][] = [];
      for (let y = 0; y < height; y++) {
        const row: SerializedCell[] = [];
        rows.push(row);
        for (let x = 0; x < width; x++) {
          const cell = map.getCellAt({ x, y });
          row.push({ type: cell.type, bitMask: cell.bitMask });
        }
      }

      return {
        id: 1,
        width,
        height,
        tileset,
        rows
      };
    }
  };

  return map;
};
