<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import Camera from "./Camera.vue";
import GameMap from "./Map.vue";
import { Assets } from "pixi.js";
import { useScreen } from "vue3-pixi";
import { Spritesheet } from "pixi.js";
import { toScreenCoords } from "../utils/helpers";
import { CELL_SIZE } from "../utils/constants";
import { useCurrentPlayer } from "../composables/useCurrentPlayer";
import { useDebugOptions } from "../composables/useDebugOptions";

const { state } = useGameState();
const screen = useScreen();

const assetNames = {
  bundle: `${state.value.snapshot.map.tileset}-map`,
  tileset: `${state.value.snapshot.map.tileset}-tileset`,
};

const bundleIds = [assetNames.bundle];

const spritesheet = ref<Spritesheet>();

onMounted(async () => {
  const assets = await Assets.loadBundle(bundleIds);
  spritesheet.value = assets[assetNames.bundle][assetNames.tileset];
});

const currentPlayer = useCurrentPlayer();
const debugOptions = useDebugOptions();
</script>

<template>
  <text
    v-if="!spritesheet"
    :anchor="0.5"
    :x="screen.width / 2"
    :y="screen.height / 2"
    :style="{ fill: 'white' }"
  >
    Loading...
  </text>

  <Camera v-else>
    <GameMap :spritesheet="spritesheet" />

    <graphics
      v-for="obstacle in state.snapshot.obstacles"
      :key="obstacle.entity_id"
      :position="toScreenCoords(obstacle.bbox)"
      @render="
        (graphics) => {
          graphics.clear();

          if (debugOptions.obstacles) {
            graphics.beginFill('yellow', 0.25);
            graphics.lineStyle({
              color: 'yellow',
              width: 1,
            });
            graphics.drawRect(
              (-obstacle.bbox.width * CELL_SIZE) / 2,
              (-obstacle.bbox.height * CELL_SIZE) / 2,
              CELL_SIZE,
              CELL_SIZE
            );

            graphics.endFill();
          }

          if (debugOptions.obstaclesMinkowski) {
            graphics.beginFill('yellow', 0.1);
            graphics.lineStyle({
              color: 'blue',
              alpha: 0.6,
              width: 1,
            });
            if (currentPlayer) {
              graphics.drawRect(
                (-(obstacle.bbox.width + currentPlayer.bbox.width) *
                  CELL_SIZE *
                  0.9) /
                  2,
                (-(obstacle.bbox.height + currentPlayer.bbox.height) *
                  CELL_SIZE *
                  0.9) /
                  2,
                (obstacle.bbox.width + currentPlayer.bbox.width) *
                  CELL_SIZE *
                  0.9,
                (obstacle.bbox.height + currentPlayer.bbox.height) *
                  CELL_SIZE *
                  0.9
              );
            }
            graphics.endFill();
          }
        }
      "
    />

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>
</template>
