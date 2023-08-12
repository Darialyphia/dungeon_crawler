<script setup lang="ts">
import { CELL_SIZE } from "../utils/constants";
import { toScreenCoords } from "../utils/helpers";
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { Point } from "@dungeon-crawler/shared";

const props = defineProps<{
  position: Point;
  cell: SerializedGameState["map"]["rows"][number][number];
}>();
const screenRect = computed(() => toScreenCoords(props.position));

const COLOR_DICT = new Map([
  [0, 0x55aa00],
  [1, 0x1111cc],
  [2, 0x222200],
]);
const color = computed(() => COLOR_DICT.get(props.cell));
</script>

<template>
  <graphics
    :x="screenRect.x"
    :y="screenRect.y"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.lineStyle({
          width: 1,
          color: 0x000000,
        });
        graphics.beginFill(color);
        graphics.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
        graphics.endFill();
      }
    "
  >
    <text
      :x="CELL_SIZE / 2"
      :y="CELL_SIZE / 2"
      anchor="0.5"
      :style="{ fill: 'white', fontSize: 10 }"
    >
      x: {{ props.position.x }}\ny: {{ props.position.y }}
    </text>
  </graphics>
</template>

<style scoped lang="postcss"></style>
