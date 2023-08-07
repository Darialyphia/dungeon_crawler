<script setup lang="ts">
import { Application } from "vue3-pixi";
import { SerializedGameState } from "../../game-engine/src";

const { state, height, width } = defineProps<{
  width: number;
  height: number;
  player: { id: string; name: string };
  state: SerializedGameState;
}>();

const getPosition = (pos: { x: number; y: number }) => {
  return {
    x: (pos.x * width) / state.map.width,
    y: (pos.y * height) / state.map.height,
  };
};
</script>

<template>
  <div class="game-client-wrapper" @keydown.stop @keyup.stop @click.stop>
    <Application :width="width" :height="height">
      <graphics
        v-bind="getPosition(entity.position)"
        v-for="entity in state.entities"
        @render="
          (graphics) => {
            graphics.clear();
            graphics.beginFill(0xde3249);
            graphics.drawCircle(0, 0, 50);
            graphics.endFill();
          }
        "
      />
    </Application>
  </div>
</template>
