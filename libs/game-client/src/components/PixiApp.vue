<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import Camera from "./Camera.vue";
import GameMap from "./Map.vue";
import { Assets } from "pixi.js";
import { useScreen } from "vue3-pixi";

const { state } = useGameState();
const screen = useScreen();

const bundleIds = [`map-${state.value.snapshot.map.tileset}`];

const isLoading = ref(true);

onMounted(async () => {
  const assets = await Assets.loadBundle(bundleIds);
  console.log(assets);
  isLoading.value = false;
});
</script>

<template>
  <text
    v-if="isLoading"
    :anchor="0.5"
    :x="screen.width / 2"
    :y="screen.height / 2"
    :style="{ fill: 'white' }"
  >
    Loading...
  </text>

  <Camera v-else>
    <GameMap />

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>
</template>
