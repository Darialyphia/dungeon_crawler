<script setup lang="ts">
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { useGameStateProvider } from "../composables/useGameState";
import { useDispatchProvider } from "../composables/useDispatch";
import { useControls } from "../composables/useControls";
import { DispatcherArg } from "../composables/useDispatch";

const props = defineProps<{
  state: SerializedGameState;
  playerId: string;
}>();

const emit = defineEmits<{
  "game:event": [DispatcherArg];
}>();

useGameStateProvider(toRef(props, "state"));
useDispatchProvider((arg) => emit("game:event", arg));
useControls(props.playerId);
</script>

<template>
  <slot />
</template>

<style scoped lang="postcss"></style>
