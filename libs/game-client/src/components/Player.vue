<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { useGameState } from "../composables/useGameState";
import { useScreen } from "vue3-pixi";

const props = defineProps<{
  player: SerializedGameState["players"][number];
}>();

const { state } = useGameState();
const screen = useScreen();

const position = computed(() => {
  const { bbox } = props.player;

  return {
    x: (bbox.x * screen.value.width) / state.value.map.width,
    y: (bbox.y * screen.value.height) / state.value.map.height,
  };
});

const size = computed(() => {
  const { bbox } = props.player;

  return {
    w: (bbox.w * screen.value.width) / state.value.map.width,
    h: (bbox.h * screen.value.height) / state.value.map.height,
  };
});
</script>

<template>
  <graphics
    v-bind="position"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.beginFill(0xde3249);
        graphics.drawEllipse(0, 0, size.w, size.h);
        graphics.endFill();
      }
    "
  />
</template>
