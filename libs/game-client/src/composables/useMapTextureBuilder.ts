import { Graphics, RenderTexture, Spritesheet } from "pixi.js";
import { CELL_TYPES, CellType } from "@dungeon-crawler/game-engine";
import {
  Nullable,
  Point,
  fromEntries,
  isDefined,
  randomInt,
} from "@dungeon-crawler/shared";
import { CELL_SIZE } from "../utils/constants";
import { useRenderer } from "vue3-pixi";
import {
  SerializedCell,
  SerializedMap,
} from "@dungeon-crawler/game-engine/src/features/map/map.factory";

type Cell = Point & SerializedCell;
export type NeighborRow = [CellType, CellType, CellType];
export type Neighborhood = [NeighborRow, NeighborRow, NeighborRow];

// prettier-ignore
type NeighborhoodCoords = [
  [Nullable<[number, number]>, Nullable<[number, number]>, Nullable<[number, number]>],
  [Nullable<[number, number]>, [number, number], Nullable<[number, number]>],
  [Nullable<[number, number]>, Nullable<[number, number]>, Nullable<[number, number]>]
];
type Texture = Spritesheet["textures"][string];
type GroupedTextures = {
  base: Record<CellType, Texture>;
  edges: Record<CellType, Texture[]>;
  decorations: Record<CellType, Texture[]>;
};

const TERRAIN_TYPES = Object.keys(CELL_TYPES).length;
const BASE_TEXTURE = 1;
const EDGES_TEXTURES = 14;
const DECORATIONS_TEXTURES = 9;
const TILES_PER_SPRITESHEET =
  TERRAIN_TYPES * (BASE_TEXTURE + EDGES_TEXTURES + DECORATIONS_TEXTURES);

const groupTextures = (spritesheet: Spritesheet): GroupedTextures => {
  const textures = Object.values(spritesheet.textures);
  if (textures.length !== TILES_PER_SPRITESHEET) {
    throw new Error(`
      Cannot interpret Spritesheet: wrong amount of textures : ${
        textures.length
      }. A spritesheet should have exactly ${TILES_PER_SPRITESHEET} textures:
      - first ${TERRAIN_TYPES} are base texture for ${Object.keys(
      CELL_TYPES
    ).join(", ")}
      - following ${
        TERRAIN_TYPES * EDGES_TEXTURES
      } are edges textures for each terrain type
      - following ${
        TERRAIN_TYPES * DECORATIONS_TEXTURES
      } are decoration textures for each terrain type
    `);
  }

  return {
    base: fromEntries(
      Object.values(CELL_TYPES).map(
        (value) => [value, textures[value]] as [CellType, Texture]
      )
    ),
    edges: fromEntries(
      Object.values(CELL_TYPES).map((value) => {
        const start = TERRAIN_TYPES + value * EDGES_TEXTURES;
        const end = start + EDGES_TEXTURES;
        return [value, textures.slice(start, end)] as [CellType, Texture[]];
      })
    ),
    decorations: fromEntries(
      Object.values(CELL_TYPES).map((value) => {
        // prettier-ignore
        const start = TERRAIN_TYPES + (TERRAIN_TYPES * EDGES_TEXTURES) + (value * DECORATIONS_TEXTURES);
        const end = start + DECORATIONS_TEXTURES;
        return [value, textures.slice(start, end)] as [CellType, Texture[]];
      })
    ),
  };
};

// prettier-ignore
const NEIGHBORS_WEIGHT = [
  2 , 3 , 5 ,
  7 , 0 , 11,
  13, 17, 19
] as const
const isMatch = (n: number) => (weight: number) => {
  return weight % n === 0;
};
const isTopLeftMatch = isMatch(NEIGHBORS_WEIGHT[0]);
const isTopMatch = isMatch(NEIGHBORS_WEIGHT[1]);
const isTopRightMatch = isMatch(NEIGHBORS_WEIGHT[2]);
const isLeftMatch = isMatch(NEIGHBORS_WEIGHT[3]);
const isRightMatch = isMatch(NEIGHBORS_WEIGHT[5]);
const isBottomLeftMatch = isMatch(NEIGHBORS_WEIGHT[6]);
const isBottomMatch = isMatch(NEIGHBORS_WEIGHT[7]);
const isBottomRightMatch = isMatch(NEIGHBORS_WEIGHT[8]);
// prettier-ignore
const coords = [
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 0],  [0, 0],  [1, 0]],
  [[-1, 1],  [0, 1],  [1, 1]],
] satisfies NeighborhoodCoords

const getNeighbors = (
  { x, y }: Cell,
  getCellType: (pt: Point) => Nullable<CellType>
): Neighborhood => {
  return coords.map((row) =>
    row.map(([dx, dy]) => getCellType({ x: x + dx, y: y + dy }))
  ) as Neighborhood;
};

const getWeight = (cells: Neighborhood) => {
  const baseType = cells[1][1];

  return cells.flat().reduce((weight, type, index) => {
    if (!isDefined(type) || type === baseType) return weight;
    if (type === CELL_TYPES.WALL) return weight; // @FIXME not the place to do this

    return weight * (NEIGHBORS_WEIGHT[index] ?? 1);
  }, 1 as number);
};

export const useMapTextureBuilder = (
  spritesheet: Spritesheet,
  map: Ref<SerializedMap>
) => {
  const renderer = useRenderer();
  const textures = groupTextures(spritesheet);

  const addLayer = (g: Graphics, texture: Texture) => {
    // texture.baseTexture.wrapMode = WRAP_MODES.CLAMP;
    g.beginTextureFill({
      texture: texture,
    });
    g.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
  };

  const getEdgesTextures = ({ type }: Cell, weight: number): Texture[] => {
    const isWall = type === CELL_TYPES.WALL;
    const texturesToApply: Texture[] = [];

    const edgeTextures = {
      TOP_LEFT_INNER_CORNER: textures.edges[type][0],
      TOP_EDGE: textures.edges[type][1],
      WALL_BOTTOM_ON_RIGHT: textures.edges[type][2],
      WALL_BOTTOM_ON_LEFT: textures.edges[type][3],
      TOP_RIGHT_INNER_CORNER: textures.edges[type][4],
      LEFT_EDGE: textures.edges[type][5],
      TOP_LEFT_OUTER_CORNER: textures.edges[type][6],
      TOP_RIGHT_OUTER_CORNER: textures.edges[type][7],
      BOTTOM_RIGHT_OUTER_CORNER: textures.edges[type][8],
      BOTTOM_LEFT_OUTER_CORNER: textures.edges[type][9],
      RIGHT_EDGE: textures.edges[type][10],
      BOTTOM_LEFT_INNER_CORNER: textures.edges[type][11],
      BOTTOM_EDGE: textures.edges[type][12],
      BOTTOM_RIGHT_INNER_CORNER: textures.edges[type][13],
    };

    // NOTE: the order of the matchers matter for the visual of the resulting texture
    // prettier-ignore
    const matchers = {
      LEFT_EDGE: isLeftMatch(weight),
      RIGHT_EDGE: isRightMatch(weight),
      BOTTOM_EDGE: isBottomMatch(weight),
      TOP_EDGE: isTopMatch(weight),
      WALL_BOTTOM_ON_LEFT: isWall && !isBottomMatch(weight) && !isTopMatch(weight) && !isLeftMatch(weight) && isBottomLeftMatch(weight),
      WALL_BOTTOM_ON_RIGHT: isWall && !isBottomMatch(weight) && !isTopMatch(weight) && !isRightMatch(weight) && isBottomRightMatch(weight),
      TOP_LEFT_INNER_CORNER: isLeftMatch(weight) && isTopMatch(weight) && isTopLeftMatch(weight),
      TOP_RIGHT_INNER_CORNER: isRightMatch(weight) && isTopMatch(weight) && isTopRightMatch(weight),
      BOTTOM_LEFT_INNER_CORNER: isLeftMatch(weight) && isBottomMatch(weight) && isBottomLeftMatch(weight),
      BOTTOM_RIGHT_INNER_CORNER: isRightMatch(weight) && isBottomMatch(weight) && isBottomRightMatch(weight),
      TOP_LEFT_OUTER_CORNER: !isLeftMatch(weight) && !isTopMatch(weight) && isTopLeftMatch(weight),
      TOP_RIGHT_OUTER_CORNER: !isRightMatch(weight) && !isTopMatch(weight) && isTopRightMatch(weight),
      BOTTOM_LEFT_OUTER_CORNER: !isWall && !isLeftMatch(weight) && !isBottomMatch(weight) && isBottomLeftMatch(weight),
      BOTTOM_RIGHT_OUTER_CORNER: !isWall && !isRightMatch(weight) && !isBottomMatch(weight) && isBottomRightMatch(weight),
    }

    Object.entries(matchers).forEach(([k, isMatch]) => {
      if (isMatch) {
        texturesToApply.push(edgeTextures[k as keyof typeof edgeTextures]);
      }
    });

    return texturesToApply;
  };

  const cache = new Map<string, RenderTexture>();
  const decorationSeedCache = new Map<string, number>();

  const getDecorationSeed = ({ x, y, type }: Cell) => {
    const key = `${x}:${y}`;
    if (!decorationSeedCache.has(key)) {
      const decorations = textures.decorations[type];
      decorationSeedCache.set(key, randomInt(decorations.length - 1));
    }
    return decorationSeedCache.get(key)!;
  };

  const getTextureFor = (cell: Cell): RenderTexture => {
    const neighbors = getNeighbors(cell, ({ x, y }) => {
      return map.value.rows[y]?.[x]?.type;
    });
    const weight = getWeight(neighbors);
    const decorationSeed = getDecorationSeed(cell);

    const key = `${cell.type}:${weight}:${decorationSeed}`;

    if (!cache.has(key)) {
      const g = new Graphics();
      addLayer(g, textures.base[cell.type]);
      const edgeTextures = getEdgesTextures(cell, weight);

      edgeTextures.forEach((texture) => {
        addLayer(g, texture);
      });

      const hasDecoration =
        cell.type !== CELL_TYPES.WALL || isBottomMatch(weight);

      if (hasDecoration) {
        const decorations = textures.decorations[cell.type];
        addLayer(g, decorations[decorationSeed]);
      }

      cache.set(key, renderer.value.generateTexture(g));
      g.destroy();
    }

    return cache.get(key)!;
  };

  watchEffect(() => {
    map.value.rows.forEach((row, y) => {
      row.forEach((cell, x) => {
        requestIdleCallback(() => {
          getTextureFor({ x, y, ...cell });
        });
      });
    });
  });

  return { getTextureFor };
};
