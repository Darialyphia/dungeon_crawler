<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { useGameState } from "../composables/useGameState";
import { useScreen, onTick } from "vue3-pixi";
import { interpolatePosition } from "../utils/interpolate";
import { Point } from "@dungeon-crawler/shared";

const props = defineProps<{
  player: SerializedGameState["players"][number];
}>();

const { state, prevState } = useGameState();
const screen = useScreen();

const gameCoordToScreenCoord = ({ x, y }: Point) => {
  return {
    x: (x * screen.value.width) / state.value.snapshot.map.width,
    y: (y * screen.value.height) / state.value.snapshot.map.height,
  };
};
const position = ref(gameCoordToScreenCoord(props.player.bbox));

onTick(() => {
  if (!prevState.value) {
    position.value = gameCoordToScreenCoord(props.player.bbox);
  } else {
    const interpolated = interpolatePosition(
      {
        position: props.player.bbox,
        t: state.value.timestamp,
      },
      {
        position: prevState.value.snapshot.players[props.player.entity_id].bbox,
        t: prevState.value.timestamp,
      }
    );
    position.value = gameCoordToScreenCoord(interpolated);
  }
});
</script>

<template>
  <graphics
    v-bind="position"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.beginFill(0xde3249);
        graphics.drawEllipse(0, 0, 15, 15);
        graphics.endFill();
      }
    "
  />
</template>
