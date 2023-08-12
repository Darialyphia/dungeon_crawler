<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import Camera from "./Camera.vue";
import GameMap from "./Map.vue";

import Debug from "./Debug.vue";

const { state } = useGameState();
</script>

<template>
  <Camera>
    <GameMap />

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>

  <Debug />
</template>
