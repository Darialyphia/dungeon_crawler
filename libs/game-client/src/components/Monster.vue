<script setup lang="ts">
import { SerializedPlayerState } from '@dungeon-crawler/game-engine';
import { useGameState } from '../composables/useGameState';
import { onTick } from 'vue3-pixi';
import { interpolatePosition } from '../utils/interpolate';
import { toScreenCoords } from '../utils/helpers';
import { Point } from '@dungeon-crawler/shared';
import { FrameObject, Texture } from 'pixi.js';
import { createSpritesheetFrameObject } from '../utils/frame-object';
import { useSprite } from '../composables/useAssetCache';
import { useAutoDestroy } from '../composables/useAutoDestroy';
import { AnimatedSprite } from 'pixi.js';
import { OutlineFilter } from '@pixi/filter-outline';
import HitBox from './HitBox.vue';

const props = defineProps<{
  monster: SerializedPlayerState['monsters'][number];
}>();

const { state, prevState } = useGameState();

const position = ref<Point>(props.monster.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const interpolatePlayerPosition = () => {
  if (!prevState.value) {
    position.value = props.monster.bbox;
    return;
  }
  const prevPosition = prevState.value.snapshot.players[props.monster.entity_id]?.bbox;
  if (!prevPosition) {
    position.value = props.monster.bbox;
    return;
  }

  const interpolated = interpolatePosition(
    {
      position: props.monster.bbox,
      t: state.value.timestamp
    },
    {
      position: prevPosition,
      t: prevState.value.timestamp
    }
  );

  position.value = interpolated;
};

onTick(interpolatePlayerPosition);

const { sheet } = useSprite(props.monster.spritable.sprite);

const textures = ref<FrameObject[]>([]);
const animationState = computed(() => props.monster.animatable.state);
const sprite = ref<AnimatedSprite>();

watch(
  [animationState, sheet],
  ([state, sheet]) => {
    if (sheet) {
      textures.value = createSpritesheetFrameObject(state, sheet);
      setTimeout(() => {
        if (!sprite.value?.playing) {
          sprite.value?.gotoAndPlay(0);
        }
      });
    }
  },
  { immediate: true }
);

const { autoDestroyRef } = useAutoDestroy();

const filter = new OutlineFilter(2, 0xff0000);

const isHovered = ref(false);
watchEffect(() => {
  if (!sprite.value) return;
  sprite.value.filters = isHovered.value ? [filter] : [];
});

const loop = computed(() => ['idle', 'walking'].includes(props.monster.animatable.state));
</script>

<template>
  <HitBox :entity="props.monster">
    <container
      :ref="autoDestroyRef"
      :position="screenPosition"
      event-mode="static"
      :z-index="props.monster.bbox.y + 0.000001"
      cullable
      @pointerenter="isHovered = true"
      @pointerout="isHovered = false"
    >
      <animated-sprite
        v-if="textures?.length"
        ref="sprite"
        :textures="(textures as unknown as Texture[])"
        :scale-x="props.monster.orientation === 'left' ? -1 : 1"
        :anchor="0.5"
        playing
        :loop="loop"
      />
    </container>
  </HitBox>
</template>
