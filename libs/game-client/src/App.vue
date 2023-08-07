<script setup lang="ts">
import GameClient from "./GameClient.vue";

const root = ref();
const { width, height } = useElementBounding(root);

const player = { id: "player", name: "Player" };
</script>

<template>
  <div ref="root">
    <GameClient :width="width" :player="player" :height="height" />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body,
#app {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}
div {
  height: 100%;
}
</style>
