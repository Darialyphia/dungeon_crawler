<script setup lang="ts">
import { Point } from "@dungeon-crawler/shared";
import { CELL_SIZE } from "../utils/constants";
import { toScreenCoords } from "../utils/helpers";
import { SerializedGameState } from "@dungeon-crawler/game-engine";

const props = defineProps<{
  position: Point;
  cell: SerializedGameState["map"]["rows"][number][number];
}>();
const screenRect = computed(() => ({
  ...toScreenCoords(props.position),
  width: CELL_SIZE,
  height: CELL_SIZE,
}));

const COLOR_DICT = new Map([
  [0, 0x00ff00],
  [1, 0x0000ff],
  [2, 0x333300],
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
        graphics.beginFill(color, 0.5);
        graphics.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
        graphics.endFill();
      }
    "
  />
</template>

<style scoped lang="postcss"></style>
