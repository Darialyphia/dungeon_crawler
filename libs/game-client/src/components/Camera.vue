<script setup lang="ts">
import { Container } from 'pixi.js';
import { useCameraProvider } from '../composables/useCamera';
import Debug from './Debug.vue';

const container = ref<Container>();
const { position, scale, pivot } = useCameraProvider(container);
</script>

<template>
  <container
    ref="container"
    :position="position"
    :scale="scale"
    :pivot="pivot"
    :sortable-children="true"
  >
    <slot />
  </container>
  <Debug />
</template>
