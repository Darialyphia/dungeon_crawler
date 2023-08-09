<script setup lang="ts">
import { Container } from "pixi.js";
import { useCameraProvider } from "../composables/useCamera";

const container = ref<Container>();
const { position } = useCameraProvider(container);
</script>

<template>
  <container :position="position" ref="container">
    <slot />
  </container>
</template>
