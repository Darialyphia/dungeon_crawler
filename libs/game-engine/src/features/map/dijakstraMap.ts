import { Point, isDefined } from '@dungeon-crawler/shared';

// prettier-ignore
const neighborCoords: [number, number][] = [
   [0, -1],
  [-1, 0],           [1, 0],
   [0, 1], 
]

export type DijakstraMapOptions<T extends Point> = {
  rows: T[][];
  sentry: T;
  isWalkable: (cell: T) => boolean;
};
export const makeDijakstraMap = <TInput extends Point, TOutput>(
  { rows, sentry, isWalkable }: DijakstraMapOptions<TInput>,
  cb: (cell: TInput, distance: number | null) => TOutput
): TOutput[][] => {
  type Item = { item: TInput; prev: Item | null };

  const cache = new Map<string, Item>();
  const getKey = ({ x, y }: Point) => `${x},${y}`;
  cache.set(getKey(sentry), { item: sentry, prev: null });

  const getNeighbors = ({ item }: Item) => {
    return neighborCoords
      .map(([x, y]) => rows[item.y + y]?.[item.x + x])
      .filter(n => isDefined(n) && isWalkable(n));
  };

  const compute = ({ x, y }: Point) => {
    const toProcess: Item[] = [{ item: sentry, prev: null }];

    while (toProcess.length) {
      let item = toProcess.shift() as Item;
      if (item.item.x == x && item.item.y == y) {
        return;
      }
      const neighbors = getNeighbors(item);
      neighbors.forEach(neighbor => {
        const key = getKey(neighbor);
        if (cache.has(key)) return;
        const newItem = { item: neighbor, prev: item };
        toProcess.push(newItem);
        cache.set(key, newItem);
      });
    }
  };

  const getDistance = ({ x, y }: Point) => {
    const key = getKey({ x, y });
    if (!cache.has(key)) {
      compute({ x, y });
    }
    let item = cache.get(key) ?? null;
    if (!item) return null;

    let length = -1;
    while (item) {
      length++;
      item = item.prev;
    }

    return length;
  };

  return rows.map(row =>
    row.map(cell => {
      return isWalkable(cell) ? cb(cell, getDistance(cell)) : cb(cell, null);
    })
  );
};
