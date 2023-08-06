<script setup lang="ts">
import { Application } from "vue3-pixi";
const text = ref("hello world from game Client");
</script>

<template>
  <Application :width="640" :height="480">
    <text :anchor="0.5" :x="320" :y="240" :style="{ fill: 'white' }">
      {{ text }}
    </text>
  </Application>
</template>
