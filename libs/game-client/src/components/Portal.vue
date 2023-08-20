<script setup lang="ts">
import { SerializedPlayerState } from '@dungeon-crawler/game-engine';
import { toScreenCoords } from '../utils/helpers';
import { Point, dist } from '@dungeon-crawler/shared';
import { FrameObject, Texture } from 'pixi.js';
import { createSpritesheetFrameObject } from '../utils/frame-object';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { useSprite } from '../composables/useAssetCache';
import { useAutoDestroy } from '../composables/useAutoDestroy';

const props = defineProps<{
  portal: SerializedPlayerState['portals'][number];
}>();

const position = ref<Point>(props.portal.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const spriteName = computed(() =>
  props.portal.portal.isEntrance ? 'portalIn' : 'portalOut'
);
const { sheet } = useSprite(spriteName);
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

const player = useCurrentPlayer();

const distance = computed(() =>
  player.value ? dist(props.portal.bbox, player.value.bbox) : Infinity
);

const isInteractable = computed(
  () => distance.value <= props.portal.interactive.activationRange
);

const text = computed(() =>
  props.portal.portal.isEntrance ? 'F: previous zone' : 'F: next zone'
);
const { autoDestroyRef } = useAutoDestroy();
</script>

<template>
  <animated-sprite
    v-if="textures?.length"
    :ref="autoDestroyRef"
    :textures="(textures as unknown as Texture[])"
    :position="screenPosition"
    :anchor="0.5"
    :z-index="props.portal.bbox.y"
    playing
  />

  <graphics
    v-if="isInteractable"
    :ref="autoDestroyRef"
    :x="0"
    :y="0"
    :position="{ x: screenPosition.x, y: screenPosition.y - 45 }"
    :z-index="9999"
    @render="
      graphics => {
        graphics.clear();

        graphics.beginFill(0x000000, 0.5);
        graphics.drawRoundedRect(0, 0, 60, 20, 3);
        graphics.endFill();
      }
    "
  >
    <text
      :anchor="0.5"
      :scale="0.5"
      :x="30"
      :y="10"
      :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
    >
      {{ text }}
    </text>
  </graphics>
</template>
