<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";

const { state } = useGameState();
</script>

<template>
  <Player
    v-for="player in state.players"
    :key="player.entity_id"
    :player="player"
  />
</template>
