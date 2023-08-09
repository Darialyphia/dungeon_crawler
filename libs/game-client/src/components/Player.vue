<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { useGameState } from "../composables/useGameState";
import { onTick } from "vue3-pixi";
import { interpolatePosition } from "../utils/interpolate";
import { Point, mulVector } from "@dungeon-crawler/shared";
import { CELL_SIZE } from "../utils/constants";
import { useCamera } from "../composables/useCamera";
import { useCurrentPlayer } from "../composables/useCurrentPlayer";

const props = defineProps<{
  player: SerializedGameState["players"][number];
}>();

const { state, prevState } = useGameState();

const gameCoordToScreenCoord = (point: Point) => mulVector(point, CELL_SIZE);
const position = ref(gameCoordToScreenCoord(props.player.bbox));

const currentPlayer = useCurrentPlayer();
const camera = useCamera();

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

    if (currentPlayer.id === props.player.player.id) {
      camera.centerOn(position.value);
    }
  }
});
</script>

<template>
  <graphics
    :position="position"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.beginFill(0xde3249);
        graphics.drawCircle(0, 0, CELL_SIZE / 2);
        graphics.endFill();
      }
    "
  />
</template>
