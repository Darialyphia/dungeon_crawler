<script setup lang="ts">
import { useApplication, onTick } from "vue3-pixi";
import { useGameState } from "../composables/useGameState";
import { useCamera } from "../composables/useCamera";

const fps = ref(0);
const app = useApplication();
const { state } = useGameState();
const { viewport } = useCamera();

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

const roundedViewport = computed(() => ({
  x: Math.round(viewport.value.x),
  y: Math.round(viewport.value.y),
  width: Math.round(viewport.value.width),
  height: Math.round(viewport.value.height),
}));
</script>

<template>
  <graphics
    :x="0"
    :y="0"
    @render="
      (graphics) => {
        graphics.clear();

        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(0, 0, 100, 140);
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
    <text :x="10" :y="45" :style="{ fill: 'white', fontSize: 12 }">
      camera: {{ roundedViewport }}
    </text>
  </graphics>
</template>
