<script setup lang="ts">
import { useGameState } from '../composables/useGameState';
import Player from './Player.vue';
import Monster from './Monster.vue';
import Portal from './Portal.vue';
import Camera from './Camera.vue';
import GameMap from './Map.vue';
import Obstacles from './Obstacles.vue';
import { useScreen } from 'vue3-pixi';
import { Spritesheet } from 'pixi.js';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { ASSET_BUNDLES } from '../assets-manifest';
import { useAssetCacheProvider } from '../composables/useAssetCache';
import HitBox from './HitBox.vue';

const { state } = useGameState();
const screen = useScreen();

const spritesheet = ref<Spritesheet>();

const { bundles, loadBundle } = useAssetCacheProvider();

onMounted(async () => {
  await Promise.all([
    loadBundle(ASSET_BUNDLES.TILESETS),
    loadBundle(ASSET_BUNDLES.SPRITES),
    loadBundle(ASSET_BUNDLES.PREFABS)
  ]);

  spritesheet.value = bundles[ASSET_BUNDLES.TILESETS]['base'];
});

const currentPlayer = useCurrentPlayer();
</script>

<template>
  <text
    v-if="!spritesheet || !currentPlayer"
    :anchor="0.5"
    :x="screen.width / 2"
    :y="screen.height / 2"
    :style="{ fill: 'white' }"
  >
    Loading...
  </text>

  <Camera v-else>
    <GameMap :spritesheet="spritesheet" />

    <HitBox
      v-for="obstacle in state.snapshot.debugObstacles"
      :key="obstacle.entity_id"
      :entity="obstacle"
    />

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />

    <Monster
      v-for="monster in state.snapshot.monsters"
      :key="monster.entity_id"
      :monster="monster"
    />
    <Portal
      v-for="portal in state.snapshot.portals"
      :key="portal.entity_id"
      :portal="portal"
    />
    <Obstacles />
  </Camera>
</template>
