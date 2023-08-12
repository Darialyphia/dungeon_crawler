<script setup lang="ts">
import MapTile from "./MapTile.vue";
import { useGameState } from "../composables/useGameState";
import { useIdRef } from "../composables/useIdRef";

const { state } = useGameState();

let { map } = state.value.snapshot;
const mapRef = useIdRef(map);

watchEffect(() => {
  mapRef.value = state.value.snapshot.map;
});
</script>

<template>
  <template v-for="(row, y) in mapRef.rows">
    <MapTile
      v-for="(cell, x) in row"
      :key="`${x}:${y}`"
      :position="{ x, y }"
      :cell="cell"
    />
  </template>
</template>

<style scoped lang="postcss"></style>
