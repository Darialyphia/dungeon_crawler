<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import { useIdRef } from "../composables/useIdRef";
import { useCamera } from "../composables/useCamera";
import { CELL_SIZE } from "../utils/constants";
import {
  Point,
  Rectangle,
  indexToPoint,
  rectRectCollision,
} from "@dungeon-crawler/shared";
import { CellType } from "@dungeon-crawler/game-engine";
import { Graphics } from "pixi.js";
import { toScreenCoords } from "../utils/helpers";

const { state } = useGameState();
const { viewport } = useCamera();

const mapRef = useIdRef(state.value.snapshot.map);
watchEffect(() => {
  mapRef.value = state.value.snapshot.map;
});
const toPoint = (index: number) => indexToPoint(mapRef.value.width, index);

// the camera viewport in game units instead of pixel units
const gViewport = computed(() => {
  return {
    x: viewport.value.x / CELL_SIZE,
    y: viewport.value.y / CELL_SIZE,
    width: viewport.value.width / CELL_SIZE,
    height: viewport.value.height / CELL_SIZE,
  };
});

const computeChunkRect = (): Rectangle => ({
  x: gViewport.value.x - gViewport.value.width * 0.5,
  y: gViewport.value.y - gViewport.value.height * 0.5,
  width: gViewport.value.width * 2,
  height: gViewport.value.height * 2,
});
const chunkRect = ref<Rectangle>(computeChunkRect());

watchEffect(() => {
  const { x: gx, y: gy, width: gw, height: gh } = gViewport.value;
  const { x: cx, y: cy, width: cw, height: ch } = chunkRect.value;
  const threshold = 1;

  const left = gx - cx;
  const right = cx + cw - (gx + gw);
  const top = gy - cy;
  const bottom = cy + ch - (gy + gh);

  const shouldRecompute =
    left < threshold ||
    right < threshold ||
    top < threshold ||
    bottom < threshold;
  if (shouldRecompute) {
    chunkRect.value = computeChunkRect();
  }
});

const visibleCells = computed(() => {
  const visible: (Point & { type: CellType })[] = [];

  for (const [index, cell] of mapRef.value.rows.flat().entries()) {
    const { x, y } = toPoint(index);
    if (
      rectRectCollision(chunkRect.value, {
        x,
        y,
        width: 1,
        height: 1,
      })
    ) {
      visible.push({ x, y, type: cell });
    }
  }

  return visible;
});

const COLOR_DICT = new Map([
  [0, 0x55aa00],
  [1, 0x1111cc],
  [2, 0x222200],
]);

// We render a single graphics drawing all tiles instead of having a Tile component for perf reasons
const render = (graphics: Graphics) => {
  graphics.clear();
  // graphics.lineStyle({
  //   width: 1,
  //   color: 0x000000,
  // });
  visibleCells.value.forEach((cell) => {
    const { x, y } = toScreenCoords(cell);
    graphics.beginFill(COLOR_DICT.get(cell.type));
    graphics.drawRect(x, y, CELL_SIZE, CELL_SIZE);
    graphics.endFill();
  });
};
</script>

<template>
  <graphics @render="render" />
</template>

<style scoped lang="postcss"></style>
