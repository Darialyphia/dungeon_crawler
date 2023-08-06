<script setup lang="ts">
import { Application } from "vue3-pixi";

const { player, height, width } = defineProps<{
  width: number;
  height: number;
  player: { id: string; name: string };
}>();
const text = computed(() => `hello ${player.name} from game Client`);
</script>

<template>
  <Application :width="width" :height="height">
    <text
      :anchor="0.5"
      :x="width / 2"
      :y="height / 2"
      :style="{ fill: 'white' }"
    >
      {{ text }}
    </text>
  </Application>
</template>
