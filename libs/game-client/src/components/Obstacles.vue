<script setup lang="ts">
import { useCamera } from '../composables/useCamera';
import { useGameState } from '../composables/useGameState';
import Obstacle from './Obstacle.vue';
import { CELL_SIZE } from '../utils/constants';

const { state } = useGameState();
const { viewport } = useCamera();

const gViewport = computed(() => ({
  x: viewport.value.x / CELL_SIZE,
  y: viewport.value.y / CELL_SIZE,
  width: viewport.value.width / CELL_SIZE,
  height: viewport.value.height / CELL_SIZE
}));

const obstaclesInViewport = computed(() =>
  Object.values(state.value.snapshot.obstacles).filter(
    obstacle =>
      obstacle.bbox.maxX > gViewport.value.x - gViewport.value.width / 2 &&
      obstacle.bbox.minX < gViewport.value.x + gViewport.value.width / 2 &&
      obstacle.bbox.maxY > gViewport.value.y - gViewport.value.width / 2 &&
      obstacle.bbox.minY < gViewport.value.y + gViewport.value.width / 2
  )
);
</script>

<template>
  <Obstacle
    v-for="obstacle in obstaclesInViewport"
    :key="obstacle.entity_id"
    :obstacle="obstacle"
  />
</template>
