<script setup lang="ts">
import { BBox, Point } from '@dungeon-crawler/shared';
import { useDebugOptions } from '../composables/useDebugOptions';
import { toScreenCoords } from '../utils/helpers';
import { useCurrentPlayer } from '../composables/useCurrentPlayer';
import { CELL_SIZE } from '../utils/constants';
import { useGameState } from '../composables/useGameState';
import { interpolatePosition } from '../utils/interpolate';
import { onTick } from 'vue3-pixi';

const props = defineProps<{
  entity: { entity_id: number; bbox: BBox };
}>();
const debugOptions = useDebugOptions();
const currentPlayer = useCurrentPlayer();
const { state, prevState } = useGameState();

const position = ref<Point>(props.entity.bbox);
const screenPosition = computed(() => {
  return toScreenCoords(position.value);
});

const interpolatePlayerPosition = () => {
  if (!prevState.value) {
    position.value = props.entity.bbox;
    return;
  }
  const id = props.entity.entity_id;
  const prevEntity =
    prevState.value.snapshot.players[id] ||
    prevState.value.snapshot.monsters[id] ||
    prevState.value.snapshot.obstacles[id] ||
    prevState.value.snapshot.portals[id];
  if (!prevEntity) {
    position.value = props.entity.bbox;
    return;
  }
  const prevPosition = prevEntity.bbox;

  const interpolated = interpolatePosition(
    {
      position: props.entity.bbox,
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
</script>

<template>
  <slot />
  <template v-if="debugOptions.obstacles || debugOptions.obstaclesMinkowski">
    <graphics
      :position="screenPosition"
      @render="
        graphics => {
          graphics.clear();

          if (debugOptions.obstacles) {
            graphics.beginFill('yellow', 0.25);
            graphics.lineStyle({
              color: 'yellow',
              width: 1
            });
            graphics.drawRect(
              (-props.entity.bbox.width * CELL_SIZE) / 2,
              (-props.entity.bbox.height * CELL_SIZE) / 2,
              props.entity.bbox.height * CELL_SIZE,
              props.entity.bbox.width * CELL_SIZE
            );

            graphics.endFill();
          }

          if (debugOptions.obstaclesMinkowski) {
            graphics.lineStyle({
              color: 'blue',
              alpha: 0.6,
              width: 1
            });
            if (currentPlayer) {
              graphics.drawRect(
                (-(props.entity.bbox.width + currentPlayer.bbox.width) *
                  CELL_SIZE *
                  0.9) /
                  2,
                (-(props.entity.bbox.height + currentPlayer.bbox.height) *
                  CELL_SIZE *
                  0.9) /
                  2,
                (props.entity.bbox.width + currentPlayer.bbox.width) * CELL_SIZE * 0.9,
                (props.entity.bbox.height + currentPlayer.bbox.height) * CELL_SIZE * 0.9
              );
            }
          }
        }
      "
    />
  </template>
</template>

<style scoped lang="postcss"></style>
