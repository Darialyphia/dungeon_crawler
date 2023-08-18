<script setup lang="ts">
import { SerializedGameState } from '@dungeon-crawler/game-engine';
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

const props = defineProps<{
  player: SerializedGameState['players'][number];
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

  const interpolated = interpolatePosition(
    {
      position: props.player.bbox,
      t: state.value.timestamp
    },
    {
      position: prevState.value.snapshot.players[props.player.entity_id].bbox,
      t: prevState.value.timestamp
    }
  );

  position.value = interpolated;
};

onTick(interpolatePlayerPosition);
onTick(followPlayer);

const { sheet } = useSprite('orc');
const textures = ref<FrameObject[]>([]);

watch(
  [() => props.player.playerState.state, sheet],
  ([playerState, sheet]) => {
    if (sheet) {
      textures.value = createSpritesheetFrameObject(playerState, sheet);
    }
  },
  { immediate: true }
);
</script>

<template>
  <animated-sprite
    v-if="textures?.length"
    :textures="(textures as unknown as Texture[])"
    :position="screenPosition"
    :scale-x="player.orientation === 'left' ? -1 : 1"
    :anchor="0.5"
    playing
    :z-index="props.player.bbox.y + 0.0000001"
  />
  <!-- <graphics
    :position="screenPosition"
    @render="
      graphics => {
        graphics.clear();
        graphics.beginFill('red');
        graphics.drawCircle(0, 0, CELL_SIZE / 2);
        graphics.endFill();
        graphics.lineStyle({
          color: 'red',
          width: 1
        });
        graphics.drawRect(
          (-player.bbox.width * CELL_SIZE) / 2,
          (-player.bbox.height * CELL_SIZE) / 2,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    "
  /> -->
</template>
