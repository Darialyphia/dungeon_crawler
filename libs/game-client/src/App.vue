<script setup lang="ts">
import GameClient from "./GameClient.vue";

const player = { id: "player", name: "Player" };
</script>

<template>
  <GameClient :width="800" :player="player" :height="600" />
</template>
