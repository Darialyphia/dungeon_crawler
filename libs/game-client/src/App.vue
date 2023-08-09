<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import GameClient from "./GameClient.vue";

const root = ref();
const { width, height } = useElementBounding(root);

const state = ref<SerializedGameState>();

const worker = new Worker(new URL("./engine-worker.ts", import.meta.url), {
  type: "module",
});
worker.addEventListener("message", ({ data }) => {
  state.value = data;
});
worker.postMessage({
  type: "join",
  payload: { id: "player" },
});
worker.postMessage({ type: "start" });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    worker.postMessage({
      type: "start",
    });
  } else {
    worker.postMessage({
      type: "stop",
    });
  }
});
</script>

<template>
  <div ref="root">
    <GameClient
      v-if="state"
      :width="width"
      :player="{ id: 'player', name: 'Player' }"
      :height="height"
      :state="state"
      @game:event="worker.postMessage($event)"
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
