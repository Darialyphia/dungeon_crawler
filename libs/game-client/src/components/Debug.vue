<script setup lang="ts">
import { useApplication, onTick } from "vue3-pixi";
import { useGameState } from "../composables/useGameState";

const fps = ref(0);
const app = useApplication();
const { state } = useGameState();

const ping = computed(
  () => state.value.timestamp - state.value.snapshot.timestamp
);

const { history } = useRefHistory(ping, { capacity: 20 });
const averagePing = computed(() =>
  (
    history.value.reduce((total, curr) => total + curr.snapshot, 0) /
    history.value.length
  ).toFixed(0)
);
onTick(() => {
  fps.value = app.value.ticker.FPS;
  if (fps.value < 30) {
    console.warn("low FPS", fps.value);
  }
});
</script>

<template>
  <graphics
    :x="0"
    :y="0"
    @render="
      (graphics) => {
        graphics.clear();

        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(0, 0, 80, 60);
        graphics.endFill();
      }
    "
  >
    <text :x="10" :y="15" :style="{ fill: 'white', fontSize: 12 }">
      FPS: {{ fps.toFixed() }}
    </text>
    <text :x="10" :y="30" :style="{ fill: 'white', fontSize: 12 }">
      ping: {{ averagePing }}ms
    </text>
  </graphics>
</template>
