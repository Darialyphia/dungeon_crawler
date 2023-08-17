<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import { useCamera } from "../composables/useCamera";
import { CELL_SIZE } from "../utils/constants";
import {
  BBox,
  Point,
  rectRectCollision,
  rectToBBox,
} from "@dungeon-crawler/shared";
import { Graphics } from "pixi.js";
import { toScreenCoords } from "../utils/helpers";
import { Spritesheet } from "pixi.js";
import { useMapTextureBuilder } from "../composables/useMapTextureBuilder";
import { useDebugOptions } from "../composables/useDebugOptions";
import { Container } from "pixi.js";
import { MapCell } from "@dungeon-crawler/game-engine/src/features/map/map.factory";

const props = defineProps<{
  spritesheet: Spritesheet;
}>();

const { state } = useGameState();
const { viewport } = useCamera();

const allCells = ref<Map<string, MapCell>>(new Map());

watchEffect(() => {
  const getKey = ({ x, y }: Point) => `${x}:${y}`;

  state.value.snapshot.map.cells.forEach((cell) => {
    const key = getKey(cell);
    if (!allCells.value.has(key)) {
      allCells.value.set(key, cell);
    }
  });
});

const textureBuilder = useMapTextureBuilder(props.spritesheet);

// the camera viewport in game units instead of pixel units
const gViewport = computed(() =>
  rectToBBox({
    x: viewport.value.x / CELL_SIZE,
    y: viewport.value.y / CELL_SIZE,
    width: viewport.value.width / CELL_SIZE,
    height: viewport.value.height / CELL_SIZE,
  })
);

const computeChunkRect = (): BBox => {
  const r = rectToBBox({
    x: gViewport.value.x,
    y: gViewport.value.y,
    width: gViewport.value.width * 3,
    height: gViewport.value.height * 3,
  });

  return r;
};
const chunkRect = ref<BBox>(computeChunkRect());

const isAtChunkedge = () => {
  const threshold = 5;

  const left = gViewport.value.minX - chunkRect.value.minX;
  const right = chunkRect.value.maxX - gViewport.value.maxX;
  const top = gViewport.value.minY - chunkRect.value.minY;
  const bottom = chunkRect.value.maxY - gViewport.value.maxY;

  return (
    left < threshold ||
    right < threshold ||
    top < threshold ||
    bottom < threshold
  );
};

watchEffect(() => {
  if (isAtChunkedge()) {
    chunkRect.value = computeChunkRect();
  }
});

const getVisibleCells = () => {
  const visible: (Point & MapCell)[] = [];
  [...allCells.value.values()].forEach((cell) => {
    const isInside = rectRectCollision(
      {
        x: chunkRect.value.minX,
        y: chunkRect.value.minY,
        width: chunkRect.value.width,
        height: chunkRect.value.height,
      },
      {
        x: cell.x,
        y: cell.y,
        width: 1,
        height: 1,
      }
    );
    if (isInside) {
      visible.push(cell);
    }
  });
  return visible;
};

const visibleCells = ref<MapCell[]>([]);
watch(
  [chunkRect, allCells],
  () => {
    visibleCells.value = getVisibleCells();
  },
  { immediate: true, deep: true }
);
const debugOptions = useDebugOptions();

// We render a single graphics drawing all tiles instead of multiple graphics in the template
const render = (graphics: Graphics) => {
  graphics.clear();
  visibleCells.value.forEach((cell) => {
    const { x, y } = toScreenCoords(cell);

    const texture = textureBuilder.getBitmapTexture(cell);

    graphics.beginTextureFill({
      texture,
    });
    graphics.drawRect(x, y, CELL_SIZE, CELL_SIZE);
    graphics.endFill();
  });
};
</script>

<template>
  <graphics
    @render="
      (graphics: Graphics) => {
        graphics.clear();
        graphics.beginFill('black', 0.01);
        graphics.drawRect(chunkRect.minX, chunkRect.minY, chunkRect.width, chunkRect.height)
      }
    "
  />
  <graphics @render="render" />
  <template v-if="debugOptions.mapCoords">
    <container
      v-for="cell in visibleCells"
      :key="`${cell.x}:${cell.y}`"
      :position="toScreenCoords(cell)"
    >
      <text
        :anchor="0.5"
        :x="CELL_SIZE / 2"
        :y="CELL_SIZE / 2"
        :scale="0.5"
        :style="{ fill: 'white', fontSize: 12 }"
      >
        x:{{ cell.x }}\ny:{{ cell.y }}
      </text>
    </container>
  </template>

  <template v-if="debugOptions.mapBitmask">
    <container
      v-for="cell in visibleCells"
      :key="`${cell.x}:${cell.y}`"
      :position="toScreenCoords(cell)"
    >
      <text
        :anchor="0.5"
        :x="CELL_SIZE / 2"
        :y="CELL_SIZE / 2"
        :scale="0.5"
        :style="{ fill: 'white', fontSize: 12 }"
      >
        bitMask{{ cell.bitMask }}\nterrain:{{ cell.type }}
      </text>
    </container>
  </template>
</template>
