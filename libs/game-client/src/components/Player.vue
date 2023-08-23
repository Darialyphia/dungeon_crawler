<script setup lang="ts">
import { SerializedPlayerState } from '@dungeon-crawler/game-engine';
import HitBox from './HitBox.vue';
import { useGameState } from '../composables/useGameState';
import { onTick } from 'vue3-pixi';
import { interpolatePosition } from '../utils/interpolate';
import { useCamera } from '../composables/useCamera';
import { useCurrentPlayerId } from '../composables/useCurrentPlayer';
import { toScreenCoords } from '../utils/helpers';
import { Point } from '@dungeon-crawler/shared';
import { FrameObject, Texture } from 'pixi.js';
import { createSpritesheetFrameObject } from '../utils/frame-object';
import { useSprite } from '../composables/useAssetCache';
import { useAutoDestroy } from '../composables/useAutoDestroy';
import { AnimatedSprite } from 'pixi.js';

const props = defineProps<{
  player: SerializedPlayerState['players'][number];
}>();

const { state, prevState } = useGameState();
const camera = useCamera();

const currentPlayerId = useCurrentPlayerId();
const isCurrentPlayer = computed(() => currentPlayerId === props.player.player.id);

const position = ref<Point>(props.player.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const followPlayer = () => {
  if (isCurrentPlayer.value) {
    camera.centerOn(screenPosition.value);
  }
};
const interpolatePlayerPosition = () => {
  if (!prevState.value) {
    position.value = props.player.bbox;
    return;
  }
  const prevPosition = prevState.value.snapshot.players[props.player.entity_id]?.bbox;
  if (!prevPosition) {
    position.value = props.player.bbox;
    return;
  }

  const interpolated = interpolatePosition(
    {
      position: props.player.bbox,
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
onTick(followPlayer);

const { sheet } = useSprite(props.player.spritable.sprite);
const textures = ref<FrameObject[]>([]);

const sprite = ref<AnimatedSprite>();
const animationState = computed(() => props.player.animatable.state);

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

const loop = computed(() => ['idle', 'walking'].includes(props.player.animatable.state));
</script>

<template>
  <HitBox :entity="props.player">
    <container :ref="autoDestroyRef" :z-index="props.player.bbox.y + 0.0000001">
      <animated-sprite
        v-if="textures?.length"
        ref="sprite"
        :textures="(textures as unknown as Texture[])"
        :position="screenPosition"
        :scale-x="player.orientation === 'left' ? -1 : 1"
        :anchor="0.5"
        playing
        cullable
        :loop="loop"
      />
    </container>
  </HitBox>
</template>
