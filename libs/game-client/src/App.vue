<script setup lang="ts">
import { createEngineWorkerConsumer } from './engine-worker-consumer';
import GameClient from './GameClient.vue';

const root = ref();
const { width, height } = useElementBounding(root);

const { state, dispatch } = createEngineWorkerConsumer();
</script>

<template>
  <div ref="root">
    <GameClient
      v-if="state"
      :width="width"
      player-id="player"
      :height="height"
      :state="state"
      @game:event="dispatch($event)"
    />
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
