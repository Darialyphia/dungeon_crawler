<script setup lang="ts">
import { createGame, SerializedGameState } from "@dungeon-crawler/game-engine";
import GameClient from "./GameClient.vue";

const root = ref();
const { width, height } = useElementBounding(root);

const state = ref<SerializedGameState>();

const engine = createGame();
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
      :player="{ id: 'player', name: 'Player' }"
      :height="height"
      :state="state"
      @move="engine.dispatch('move', { ...$event, playerId: 'player' })"
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
