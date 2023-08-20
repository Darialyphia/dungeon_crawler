<script setup lang="ts">
import { Container } from 'pixi.js';
import { useCameraProvider } from '../composables/useCamera';
import Debug from './Debug.vue';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { toScreenCoords } from '../utils/helpers';
import { Point } from '@dungeon-crawler/shared';
import { useGameState } from '../composables/useGameState';
import { interpolatePosition } from '../utils/interpolate';
import { onTick } from 'vue3-pixi';

const container = ref<Container>();
const { position, scale, pivot } = useCameraProvider(container);

const currentPlayer = useCurrentPlayer();

const fogOfWarHolePosition = ref<Point>(currentPlayer.value!.bbox);

const { state, prevState } = useGameState();

const interpolatePlayerPosition = () => {
  const bbox = currentPlayer.value!.bbox;
  if (!prevState.value) {
    fogOfWarHolePosition.value = toScreenCoords(bbox);
    return;
  }
  const prevPosition =
    prevState.value.snapshot.players[currentPlayer.value!.entity_id]?.bbox;
  if (!prevPosition) {
    fogOfWarHolePosition.value = toScreenCoords(currentPlayer.value!.bbox);
    return;
  }

  const interpolated = interpolatePosition(
    {
      position: bbox,
      t: state.value.timestamp
    },
    {
      position: prevPosition,
      t: prevState.value.timestamp
    }
  );

  fogOfWarHolePosition.value = toScreenCoords(interpolated);
};

onTick(interpolatePlayerPosition);
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
