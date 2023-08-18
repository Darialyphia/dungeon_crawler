<script setup lang="ts">
import { useApplication, onTick } from 'vue3-pixi';
import { useGameState } from '../composables/useGameState';
import { useCamera } from '../composables/useCamera';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { toScreenCoords } from '../utils/helpers';

const fps = ref(0);
const app = useApplication();
const { state } = useGameState();
const { viewport } = useCamera();
const player = useCurrentPlayer();

const ping = computed(() => state.value.timestamp - state.value.snapshot.timestamp);

const { history } = useRefHistory(ping, { capacity: 20 });
const averagePing = computed(() =>
  (
    history.value.reduce((total, curr) => total + curr.snapshot, 0) / history.value.length
  ).toFixed(0)
);
// const WARNING_THRESHOLD = 18;
onTick(() => {
  fps.value = app.value.ticker.FPS;

  if (fps.value < 25) {
    console.warn(`low fps: ${fps.value.toFixed()}`);
  }
  // if (app.value.ticker.elapsedMS > WARNING_THRESHOLD) {
  //   console.warn('elapsed time over frame budget : ', app.value.ticker.elapsedMS);
  // }
});

const roundedViewport = computed(() => ({
  x: Math.round(viewport.value.x),
  y: Math.round(viewport.value.y),
  width: Math.round(viewport.value.width),
  height: Math.round(viewport.value.height)
}));
const roundedPlayerCoords = computed(() => ({
  x: Math.round(toScreenCoords(player.value!.bbox).x),
  y: Math.round(toScreenCoords(player.value!.bbox).y)
}));
</script>

<template>
  <graphics
    :x="0"
    :y="0"
    @render="
      graphics => {
        graphics.clear();

        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(0, 0, 120, 175);
        graphics.endFill();
      }
    "
  >
    <text
      :x="10"
      :y="15"
      :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
    >
      FPS: {{ fps.toFixed() }}
    </text>
    <text
      :x="10"
      :y="30"
      :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
    >
      ping: {{ averagePing }}ms
    </text>
    <text
      :x="10"
      :y="45"
      :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
    >
      camera: {{ roundedViewport }}
    </text>
    <text
      v-if="player"
      :x="10"
      :y="45 + 75"
      :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
    >
      player: {{ roundedPlayerCoords }}
    </text>
  </graphics>
</template>
