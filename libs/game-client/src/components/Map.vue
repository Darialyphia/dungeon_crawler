<script setup lang="ts">
import { useGameState } from '../composables/useGameState';
import { useCamera } from '../composables/useCamera';
import { CELL_SIZE } from '../utils/constants';
import { BBox, Nullable, Point, rectToBBox } from '@dungeon-crawler/shared';
import { Graphics, Texture } from 'pixi.js';
import { toScreenCoords } from '../utils/helpers';
import { Spritesheet } from 'pixi.js';
import { useMapTextureBuilder } from '../composables/useMapTextureBuilder';
import { useDebugOptions } from '../composables/useDebugOptions';
import { Container } from 'pixi.js';
import { MapCell } from '@dungeon-crawler/game-engine';

const props = defineProps<{
  spritesheet: Spritesheet;
}>();

const { state } = useGameState();
const { viewport } = useCamera();
const debugOptions = useDebugOptions();

const allCells: Record<string, MapCell> = {};
const getKey = (x: number, y: number) => `${x}:${y}` as keyof (typeof allCells)['value'];

watch(
  () => state.value.snapshot.map.id,
  () => {
    Object.keys(allCells).forEach(k => {
      delete allCells[k];
    });
  }
);

const textureBuilder = useMapTextureBuilder(props.spritesheet);

// the camera viewport in game units instead of pixel units
const gViewport = computed(() =>
  rectToBBox({
    x: viewport.value.x / CELL_SIZE,
    y: viewport.value.y / CELL_SIZE,
    width: viewport.value.width / CELL_SIZE,
    height: viewport.value.height / CELL_SIZE
  })
);

const computeChunkRect = (): BBox => {
  const r = rectToBBox({
    x: gViewport.value.x,
    y: gViewport.value.y,
    width: gViewport.value.width * 2,
    height: gViewport.value.height * 2
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

  return left < threshold || right < threshold || top < threshold || bottom < threshold;
};

watchEffect(() => {
  if (isAtChunkedge()) {
    chunkRect.value = computeChunkRect();
  }
});

const getVisibleCells = () => {
  const visible: (Point & MapCell)[] = [];
  const minX = Math.floor(chunkRect.value.minX);
  const maxX = Math.ceil(chunkRect.value.maxX);
  const minY = Math.floor(chunkRect.value.minY);
  const maxY = Math.ceil(chunkRect.value.maxY);

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const cell = allCells[getKey(x, y)];
      if (cell) {
        visible.push(cell);
      }
    }
  }

  return visible;
};

const visibleCells = ref<MapCell[]>([]);
watch(
  chunkRect,
  () => {
    visibleCells.value = getVisibleCells();
  },
  { immediate: true }
);

watchEffect(() => {
  let hasNewCell = false;
  state.value.snapshot.map.cells.forEach(cell => {
    const key = getKey(cell.x, cell.y);
    if (!allCells[key]) {
      allCells[key] = cell;
      hasNewCell = true;
    }
  });

  if (hasNewCell) {
    visibleCells.value = getVisibleCells();
  }
});

// We render a single graphics drawing all tiles instead of multiple graphics in the template
const render = (graphics: Graphics) => {
  graphics.clear();
  visibleCells.value.forEach(cell => {
    const { x, y } = toScreenCoords(cell);

    const texture = textureBuilder.getBitmaskTexture(cell);

    // graphics.lineStyle({
    //   color: 'black',
    //   width: 0.5
    // });
    graphics.beginTextureFill({
      texture
    });
    graphics.drawRect(x, y, CELL_SIZE, CELL_SIZE);

    renderFogOfWar(cell, graphics);
    graphics.endFill();
  });
};

const textures = computed(() => Object.values(props.spritesheet.textures));

const renderFogOfWar = (cell: MapCell, graphics: Graphics) => {
  const left = allCells[getKey(cell.x - 1, cell.y)];
  const right = allCells[getKey(cell.x + 1, cell.y)];
  const top = allCells[getKey(cell.x, cell.y - 1)];
  const bottom = allCells[getKey(cell.x, cell.y + 1)];
  const topLeft = allCells[getKey(cell.x - 1, cell.y - 1)];
  const topRight = allCells[getKey(cell.x + 1, cell.y - 1)];
  const bottomLeft = allCells[getKey(cell.x - 1, cell.y + 1)];
  const bottomRight = allCells[getKey(cell.x + 1, cell.y + 1)];

  let texture: Nullable<Texture> = null;
  if (!left && !bottom) {
    texture = textures.value.at(-12);
  } else if (!left && !top) {
    texture = textures.value.at(-10);
  } else if (!right && !bottom) {
    texture = textures.value.at(-6);
  } else if (!right && !top) {
    texture = textures.value.at(-8);
  } else if (!left) {
    texture = textures.value.at(-11);
  } else if (!right) {
    texture = textures.value.at(-7);
  } else if (!top) {
    texture = textures.value.at(-9);
  } else if (!bottom) {
    texture = textures.value.at(-5);
  } else if (!bottomRight) {
    texture = textures.value.at(-2);
  } else if (!bottomLeft) {
    texture = textures.value.at(-1);
  } else if (!topLeft) {
    texture = textures.value.at(-4);
  } else if (!topRight) {
    texture = textures.value.at(-3);
  }
  if (texture) {
    const { x, y } = toScreenCoords(cell);
    graphics.beginTextureFill({
      texture
    });
    graphics.drawRect(x, y, CELL_SIZE, CELL_SIZE);
  }
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
  <template v-if="debugOptions.mapDijakstra">
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
        {{ cell.dijakstra }}
      </text>
    </container>
  </template>
</template>
