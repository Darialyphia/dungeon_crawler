<script setup lang="ts">
import { Application } from "vue3-pixi";
import { SerializedGameState } from "../../game-engine/src";
import {
  GameClientEmitter,
  useDispatchProvider,
} from "./composables/useDispatch";
import { useControls } from "./composables/useControls";
import { Point } from "@dungeon-crawler/shared";

const { state, height, width } = defineProps<{
  width: number;
  height: number;
  player: { id: string; name: string };
  state: SerializedGameState;
}>();

const emit = defineEmits<GameClientEmitter>();

useDispatchProvider(emit);
useControls(emit);
const getPosition = (pos: Point) => {
  return {
    x: (pos.x * width) / state.map.width,
    y: (pos.y * height) / state.map.height,
  };
};
</script>

<template>
  <Application :width="width" :height="height">
    <graphics
      v-bind="getPosition(entity.bbox)"
      v-for="entity in state.entities"
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
