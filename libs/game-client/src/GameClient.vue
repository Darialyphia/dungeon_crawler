<script setup lang="ts">
import { Application } from "vue3-pixi";
import { SerializedGameState } from "../../game-engine/src";
import {
  GameClientEmitter,
  useDispatchProvider,
} from "./composables/useDispatch";
import { useControls } from "./composables/useControls";

const props = defineProps<{
  width: number;
  height: number;
  player: { id: string; name: string };
  state: SerializedGameState;
}>();

const emit = defineEmits<GameClientEmitter>();

useDispatchProvider(emit);
useControls(emit);

const getPosition = (entityId: number) => {
  const pos = props.state.entities[entityId].bbox;

  return {
    x: (pos.x * props.width) / props.state.map.width,
    y: (pos.y * props.height) / props.state.map.height,
  };
};
</script>

<template>
  <Application :width="width" :height="height">
    <graphics
      v-for="entity in state.entityIds"
      :key="entity"
      v-bind="getPosition(entity)"
      @render="
        (graphics) => {
          graphics.clear();
          graphics.beginFill(0xde3249);
          graphics.drawCircle(0, 0, 25);
          graphics.endFill();
        }
      "
    />
  </Application>
</template>
