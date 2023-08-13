<script setup lang="ts">
import { Container } from "pixi.js";
import { useCameraProvider } from "../composables/useCamera";
import Debug from "./Debug.vue";

const container = ref<Container>();
const { position } = useCameraProvider(container);
</script>

<template>
  <container ref="container" :position="position">
    <slot />
  </container>
  <Debug />
</template>
