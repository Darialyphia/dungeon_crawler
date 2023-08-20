<script setup lang="ts">
import { SerializedPlayerState } from '@dungeon-crawler/game-engine';
import { toScreenCoords } from '../utils/helpers';
import { Point } from '@dungeon-crawler/shared';
import { FrameObject, Texture } from 'pixi.js';
import { createSpritesheetFrameObject } from '../utils/frame-object';
import { usePrefab } from '../composables/useAssetCache';
import { useAutoDestroy } from '../composables/useAutoDestroy';

const props = defineProps<{
  obstacle: SerializedPlayerState['obstacles'][number];
}>();

const position = ref<Point>(props.obstacle.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const spriteName = computed(() => props.obstacle.spritable.sprite);
const { sheet } = usePrefab(spriteName);
const textures = ref<FrameObject[]>([]);

watch(
  sheet,
  sheet => {
    if (sheet) {
      textures.value = createSpritesheetFrameObject('idle', sheet);
    }
  },
  { immediate: true }
);

const { autoDestroyRef } = useAutoDestroy();
</script>

<template>
  <container :ref="autoDestroyRef" :position="screenPosition">
    <animated-sprite
      v-if="textures?.length"
      :textures="(textures as unknown as Texture[])"
      :anchor="0.5"
      :z-index="props.obstacle.bbox.y"
      cullable
      playing
    />
  </container>
</template>
