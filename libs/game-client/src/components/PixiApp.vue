<script setup lang="ts">
import { useGameState } from "../composables/useGameState";
import Player from "./Player.vue";
import { CELL_SIZE } from "../utils/constants";
import Camera from "./Camera.vue";

const { state } = useGameState();
</script>

<template>
  <Camera>
    <template v-for="x in state.snapshot.map.width">
      <graphics
        v-for="y in state.snapshot.map.height"
        :key="`${x}:${y}`"
        :x="(x - 1) * CELL_SIZE"
        :y="(y - 1) * CELL_SIZE"
        @render="
          (graphics) => {
            graphics.clear();
            graphics.lineStyle({
              width: 1,
              color: 0x00ff00,
            });
            graphics.beginFill(0x00ff00, 0.5);
            graphics.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
            graphics.endFill();
          }
        "
      />
    </template>

    <Player
      v-for="player in state.snapshot.players"
      :key="player.entity_id"
      :player="player"
    />
  </Camera>
</template>
