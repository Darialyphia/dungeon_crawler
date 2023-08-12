<script setup lang="ts">
import MapTile from "./MapTile.vue";
import { useGameState } from "../composables/useGameState";
import { useIdRef } from "../composables/useIdRef";
import { useCamera } from "../composables/useCamera";
import { CELL_SIZE } from "../utils/constants";
import {
  Rectangle,
  indexToPoint,
  rectRectCollision,
} from "@dungeon-crawler/shared";

const { state } = useGameState();
const { viewport } = useCamera();

const mapRef = useIdRef(state.value.snapshot.map);
watchEffect(() => {
  mapRef.value = state.value.snapshot.map;
});
const toPoint = indexToPoint(mapRef.value.width);

// the camera viewport in game units instead of pixel units
const gViewport = computed(() => {
  const { x, y, width, height } = viewport.value;

  return {
    x: x / CELL_SIZE,
    y: y / CELL_SIZE,
    width: width / CELL_SIZE,
    height: height / CELL_SIZE,
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
  const threshold = 5;
  const { x: gx, y: gy } = gViewport.value;
  const { x: cx, y: cy, width: cw, height: ch } = chunkRect.value;
  const left = gx - cx < threshold;
  const right = cx + cw - gx < threshold;
  const top = gy - cy < threshold;
  const bottom = cy + ch - gy < threshold;

  if (left || right || top || bottom) {
    chunkRect.value = computeChunkRect();
  }
});

const allCells = computed(() => {
  return mapRef.value.rows.flat().map((type, index) => ({
    ...toPoint(index),
    type,
  }));
});

const visibleCells = computed(() => {
  return allCells.value.filter((cell) =>
    rectRectCollision(chunkRect.value, {
      x: cell.x,
      y: cell.y,
      width: 1,
      height: 1,
    })
  );
});
</script>

<template>
  <graphics
    :x="0"
    :y="0"
    @render="
      (graphics) => {
        graphics.beginFill(0x000000, 0.01);
        graphics.drawRect(
          0,
          0,
          mapRef.width * CELL_SIZE,
          mapRef.height * CELL_SIZE
        );
        graphics.endFill();
      }
    "
  />
  <MapTile
    v-for="cell in visibleCells"
    :key="`${cell.x}:${cell.y}`"
    :x="cell.x"
    :y="cell.y"
    :cell="cell.type"
  />
</template>

<style scoped lang="postcss"></style>
