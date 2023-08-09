<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import Camera from "./Camera.vue";
import MapTile from "./MapTile.vue";
import Debug from "./Debug.vue";

const { state } = useGameState();
</script>

<template>
  <Camera>
    <template v-for="x in state.snapshot.map.width">
      <MapTile
        v-for="y in state.snapshot.map.height"
        :key="`${x}:${y}`"
        :position="{ x: x - 1, y: y - 1 }"
      />
    </template>

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>

  <Debug />
</template>
