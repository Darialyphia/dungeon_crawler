<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import Camera from "./Camera.vue";
import GameMap from "./Map.vue";
import { Assets } from "pixi.js";
import { useScreen } from "vue3-pixi";
import { Spritesheet } from "pixi.js";

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

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>
</template>
