<script setup lang="ts">
import { useGameState } from '../composables/useGameState';
import Player from './Player.vue';
import Portal from './Portal.vue';
import Camera from './Camera.vue';
import GameMap from './Map.vue';
import { useScreen } from 'vue3-pixi';
import { Spritesheet } from 'pixi.js';
import { toScreenCoords } from '../utils/helpers';
import { CELL_SIZE } from '../utils/constants';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { useDebugOptions } from '../composables/useDebugOptions';
import { ASSET_BUNDLES } from '../assets-manifest';
import { useAssetCacheProvider } from '../composables/useAssetCache';

const { state } = useGameState();
const screen = useScreen();

const spritesheet = ref<Spritesheet>();

const { bundles, loadBundle } = useAssetCacheProvider();

onMounted(async () => {
  await Promise.all([
    loadBundle(ASSET_BUNDLES.TILESETS),
    loadBundle(ASSET_BUNDLES.SPRITES)
  ]);

  spritesheet.value = bundles[ASSET_BUNDLES.TILESETS]['base'];
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

    <template v-if="debugOptions.obstacles || debugOptions.obstaclesMinkowski">
      <graphics
        v-for="obstacle in state.snapshot.obstacles"
        :key="obstacle.entity_id"
        :position="toScreenCoords(obstacle.bbox)"
        @render="
          graphics => {
            graphics.clear();

            if (debugOptions.obstacles) {
              graphics.beginFill('yellow', 0.25);
              graphics.lineStyle({
                color: 'yellow',
                width: 1
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
                width: 1
              });
              if (currentPlayer) {
                graphics.drawRect(
                  (-(obstacle.bbox.width + currentPlayer.bbox.width) * CELL_SIZE * 0.9) /
                    2,
                  (-(obstacle.bbox.height + currentPlayer.bbox.height) *
                    CELL_SIZE *
                    0.9) /
                    2,
                  (obstacle.bbox.width + currentPlayer.bbox.width) * CELL_SIZE * 0.9,
                  (obstacle.bbox.height + currentPlayer.bbox.height) * CELL_SIZE * 0.9
                );
              }
              graphics.endFill();
            }
          }
        "
      />
    </template>

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
    <Portal
      v-for="portal in state.snapshot.portals"
      :key="portal.entity_id"
      :portal="portal"
    />
  </Camera>
</template>
