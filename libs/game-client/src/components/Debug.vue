<script setup lang="ts">
import { useApplication, onTick } from "vue3-pixi";
const fps = ref(0);
const app = useApplication();

onTick(() => {
  fps.value = app.value.ticker.FPS;
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
        graphics.drawRect(0, 0, 80, 30);
        graphics.endFill();
      }
    "
  >
    <text
      :anchor="0.5"
      :x="40"
      :y="15"
      :style="{ fill: 'white', fontSize: 12 }"
    >
      FPS: {{ fps.toFixed() }}
    </text>
  </graphics>
</template>
