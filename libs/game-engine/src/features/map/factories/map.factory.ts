import { Point, dist, pointToIndex, randomInt } from '@dungeon-crawler/shared';
import type { MapGenerator } from '../types';
import { createCell } from './cell.factory';
import { BBoxProps } from '../../physics/physics.components';
import { makeDijakstraMap } from '../dijakstraMap';
import { createPortal } from './portal.factory';
import { MAX_ZONES } from '../../../constants';
import { GameZoneState, ZoneId } from '../../../gameZone';

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
  dijakstra: number | null;
};

export type MapFactoryOptions = {
  id: ZoneId;
  width: number;
  height: number;
  tileset: Tileset;
  generator: MapGenerator<GeneratedCell>;
};

export type GameMap = {
  width: number;
  height: number;
  init(state: GameZoneState): void;
  getEntrance(): Point;
  getExit(): Point;
  getValidSpawnPoint(): Point;
  getCellAt(pt: Point): MapCell;
  getNearby(pt: Point, radius: number): MapCell[];
  serialize(players: { bbox: BBoxProps }[]): SerializedMap;
};

export type SerializedMap = {
  id: number;
  width: number;
  height: number;
  tileset: Tileset;
  cells: MapCell[];
};

// Indicates the diff necessary to get neighbors cell
// with an index fallback in case the cell is out of bounds
// prettier-ignore
const neighborCoords: [[number, number], number][] = [
  [[-1, -1], 3], [[0, -1], 4], [[1, -1], 5],
  [[-1, 0], 4],  [[0, 0], 4],  [[1, 0], 4],
  [[-1, 1], 3],  [[0, 1], 4],  [[1, 1], 5]
]
// prettier-ignore
const weights = [
128, 1,  2 ,
64,  0,  4,
32,  16, 8
] as const

const getRandomWalkableCell = (
  rows: (Point & { type: CellType })[][],
  width: number,
  height: number
) => {
  let point = { x: randomInt(width - 1), y: randomInt(height - 1) };
  let cell = rows[point.y][point.x];

  while (cell.type !== CELL_TYPES.GROUND) {
    point = { x: randomInt(width), y: randomInt(height) };
    cell = rows[point.y][point.x];
  }

  return point;
};

export const createGameMap = ({
  id,
  width,
  height,
  tileset,
  generator
}: MapFactoryOptions): GameMap => {
  const cells = generator.getChunk({
    width,
    height,
    startsAt: { x: 0, y: 0 }
  });

  const getBitMask = ({ x, y }: Point, type: CellType, rows: GeneratedCell[][]) => {
    const isMatch = (ttype: CellType) => ttype === type;

    const getCellWithDiff = (neighborIndex: number): GeneratedCell => {
      const [[diffX, diffY], fallback] = neighborCoords[neighborIndex];
      const index = pointToIndex({ x: x + diffX, y: y + diffY }, width);

      return rows[y + diffY]?.[x + diffX] ?? getCellWithDiff(fallback);
    };

    const [topLeft, top, topRight, left, center, right, bottomLeft, bottom, bottomRight] =
      neighborCoords.map((_, index) => getCellWithDiff(index).type);

    // for a corner to match, both of its sides must match as well
    // see https://gamedevelopment.tutsplus.com/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673t
    const weight = [
      isMatch(topLeft) && isMatch(top) && isMatch(left),
      isMatch(top),
      isMatch(topRight) && isMatch(top) && isMatch(right),
      isMatch(left),
      isMatch(center),
      isMatch(right),
      isMatch(bottomLeft) && isMatch(bottom) && isMatch(left),
      isMatch(bottom),
      isMatch(bottomRight) && isMatch(bottom) && isMatch(right)
    ].reduce((weight, match, index) => {
      return match ? weight + weights[index] : weight;
    }, 0);

    return weight;
  };

  const makeRows = () => {
    const rows: Omit<MapCell, 'dijakstra' | 'bitMask'>[][] = [];
    for (let y = 0; y < height; y++) {
      const row: Omit<MapCell, 'dijakstra' | 'bitMask'>[] = [];
      rows.push(row);
      for (let x = 0; x < width; x++) {
        const cell = cells[pointToIndex({ x, y }, width)];
        row.push({
          x,
          y,
          type: cell.type
        });
      }
    }

    return rows;
  };

  const rows = makeRows();

  const entranceCoords = getRandomWalkableCell(rows, width, height);
  const entrance = rows[entranceCoords.y][entranceCoords.x]!;

  const dijakstraRows = makeDijakstraMap(
    {
      rows,
      sentry: entrance,
      isWalkable: cell => cell.type === CELL_TYPES.GROUND
    },
    (cell, distance) => {
      if (distance === null && cell.type === CELL_TYPES.GROUND) {
        return { ...cell, type: CELL_TYPES.WALL, dijakstra: distance };
      }

      return { ...cell, dijakstra: distance };
    }
  );

  const finalRows = dijakstraRows.map(row =>
    row.map(cell => ({
      ...cell,
      bitMask: getBitMask({ x: cell.x, y: cell.y }, cell.type, dijakstraRows)
    }))
  );

  const exitDistance = 10;
  const exitCandidates = finalRows
    .flatMap(row => row.flat())
    .filter(cell => cell.dijakstra === exitDistance);
  if (exitCandidates.length === 0) {
    console.warn('no exit candidate !');
  }
  const exit = exitCandidates[randomInt(exitCandidates.length - 1)];

  const map: GameMap = {
    width,
    height,
    getValidSpawnPoint() {
      const point = getRandomWalkableCell(finalRows, width, height);

      return {
        x: point.x + 0.5,
        y: point.y + 0.5
      };
    },

    init(state) {
      finalRows.forEach(row => {
        row.forEach(cell => {
          if (cell.type !== CELL_TYPES.GROUND) {
            createCell(state, cell);
          }
        });
      });

      if (state.id > 1) {
        createPortal(state, { ...entrance, isEntrance: true, isExit: false });
      }
      if (state.id < MAX_ZONES) {
        createPortal(state, { ...exit, isEntrance: false, isExit: true });
      }
    },

    getCellAt({ x, y }) {
      return finalRows[y][x];
    },

    getNearby({ x, y }, radius) {
      const minX = Math.max(0, Math.floor(x - radius));
      const minY = Math.max(0, Math.floor(y - radius));
      const maxX = Math.ceil(x + radius);
      const maxY = Math.ceil(y + radius);
      return finalRows
        .slice(minY, maxY)
        .map(row => row.slice(minX, maxX))
        .flat()
        .filter(cell => dist(cell, { x, y }) <= radius);
    },

    getEntrance() {
      return entrance;
    },

    getExit() {
      return exit;
    },

    serialize(players) {
      const visible = players.map(player => map.getNearby(player.bbox, 8));

      return {
        id,
        width,
        height,
        tileset,
        cells: [...new Set(visible.flat())]
      };
    }
  };

  return map;
};
