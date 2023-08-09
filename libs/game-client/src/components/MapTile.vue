<script setup lang="ts">
import { Point } from "@dungeon-crawler/shared";
import { CELL_SIZE } from "../utils/constants";
import { toScreenCoords } from "../utils/helpers";

const props = defineProps<{ position: Point }>();
const screenPos = computed(() => toScreenCoords(props.position));
</script>

<template>
  <graphics
    :x="screenPos.x"
    :y="screenPos.y"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.lineStyle({
          width: 1,
          color: 0x00ff00,
        });
        graphics.beginFill(0x00ff00, 0.5);
        graphics.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
        graphics.endFill();
      }
    "
  />
</template>

<style scoped lang="postcss"></style>
