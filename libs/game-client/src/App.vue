<script setup lang="ts">
import { createGame, SerializedGameState } from "@dungeon-crawler/game-engine";
import GameClient from "./GameClient.vue";

const root = ref();
const { width, height } = useElementBounding(root);

const player = { id: "player", name: "Player" };

const engine = createGame();

const state = ref<SerializedGameState>();
engine.subscribe((newState) => {
  state.value = newState;
});
engine.dispatch("join", { id: "player" });
engine.start();
</script>

<template>
  <div ref="root">
    <GameClient
      v-if="state"
      :width="width"
      :player="player"
      :height="height"
      :state="state"
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
