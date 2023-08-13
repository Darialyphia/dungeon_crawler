<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { useGameState } from "../composables/useGameState";
import { onTick } from "vue3-pixi";
import { interpolatePosition } from "../utils/interpolate";
import { CELL_SIZE } from "../utils/constants";
import { useCamera } from "../composables/useCamera";
import { useCurrentPlayerId } from "../composables/useCurrentPlayer";
import { toScreenCoords } from "../utils/helpers";
import { Point } from "@dungeon-crawler/shared";
import { Spritesheet } from "pixi.js";

const props = defineProps<{
  player: SerializedGameState["players"][number];
}>();

const { state, prevState } = useGameState();
const camera = useCamera();

const currentPlayerId = useCurrentPlayerId();
const isCurrentPlayer = computed(
  () => currentPlayerId === props.player.player.id
);

const position = ref<Point>(props.player.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const followPlayer = () => {
  if (isCurrentPlayer.value) {
    camera.centerOn(screenPosition.value);
  }
};
const interpolatePlayerPosition = () => {
  if (!prevState.value) {
    position.value = props.player.bbox;
    return;
  }

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

  position.value = interpolated;
};

const color = computed(() => (isCurrentPlayer.value ? "red" : "blue"));
onTick(interpolatePlayerPosition);
onTick(followPlayer);

const sheet = ref<Spritesheet>();
</script>

<template>
  <graphics
    :position="screenPosition"
    @render="
      (graphics) => {
        graphics.clear();
        graphics.beginFill(color);
        graphics.drawCircle(0, 0, CELL_SIZE / 2);
        graphics.endFill();
      }
    "
  >
    <sprite
      v-if="sheet"
      :texture="sheet.textures[0]"
      :anchor="0.5"
      :scale="2"
    />
  </graphics>
</template>
