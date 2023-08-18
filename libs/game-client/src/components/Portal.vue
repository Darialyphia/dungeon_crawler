<script setup lang="ts">
import { SerializedGameState } from '@dungeon-crawler/game-engine';
import { toScreenCoords } from '../utils/helpers';
import { Point, dist } from '@dungeon-crawler/shared';
import { FrameObject, Texture } from 'pixi.js';
import { createSpritesheetFrameObject } from '../utils/frame-object';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { useSprite } from '../composables/useAssetCache';
import { useAutoDestroy } from '../composables/useAutoDestroy';

const props = defineProps<{
  portal: SerializedGameState['portals'][number];
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

const { autoDestroyRef } = useAutoDestroy();
</script>

<template>
  <container :ref="autoDestroyRef">
    <animated-sprite
      v-if="textures?.length"
      :textures="(textures as unknown as Texture[])"
      :position="screenPosition"
      :anchor="0.5"
      :z-index="props.portal.bbox.y"
      playing
    />

    <graphics
      v-if="isInteractable"
      :x="0"
      :y="0"
      :position="{ x: screenPosition.x, y: screenPosition.y - 45 }"
      :z-index="9999"
      @render="
        graphics => {
          graphics.clear();

          graphics.beginFill(0x000000, 0.5);
          graphics.drawRoundedRect(0, 0, 80, 20, 3);
          graphics.endFill();
        }
      "
    >
      <text
        :anchor="0.5"
        :scale="0.5"
        :x="40"
        :y="10"
        :style="{ fill: 'white', fontSize: 12, fontFamily: 'monospace' }"
      >
        press F to enter
      </text>
    </graphics>
  </container>
</template>
