<script setup lang="ts">
import { Application } from "pixi.js";
import { appInjectKey, createApp } from "vue3-pixi";
import { SerializedGameState } from "@dungeon-crawler/game-engine";
import {
  GAME_STATE_INJECTION_KEY,
  useGameStateProvider,
} from "./composables/useGameState";
import {
  useDispatchProvider,
  DispatcherArg,
  DISPATCHER_INJECTION_KEY,
} from "./composables/useDispatch";
import { useControls } from "./composables/useControls";
import { throttle } from "lodash-es";
import PixiApp from "./components/PixiApp.vue";
import {
  CURRENT_PLAYER_INJECTION_KEY,
  useCurrentPlayerProvider,
} from "./composables/useCurrentPlayer";

const props = defineProps<{
  width: number;
  height: number;
  playerId: string;
  state: SerializedGameState;
}>();

const emit = defineEmits<{
  "game:event": [DispatcherArg];
}>();

const state = useGameStateProvider(toRef(props, "state"));
const dispatch = useDispatchProvider((arg) => emit("game:event", arg));
useCurrentPlayerProvider(props.playerId);
useControls(dispatch, props.playerId);

const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
  // We create the pixi app manually instead ofusing vue3-pixi's <Application /> component
  // because we want to be able to provide a bunch of stuff so we need access to the underlying vue app
  // and we can forward the providers to it
  const pixiApp = new Application({
    view: canvas.value,
    width: props.width,
    height: props.height,
    autoDensity: true,
    antialias: false,
  });
  const app = createApp(PixiApp);
  app.provide(appInjectKey, pixiApp);
  app.provide(GAME_STATE_INJECTION_KEY, state);
  app.provide(DISPATCHER_INJECTION_KEY, dispatch);
  app.provide(CURRENT_PLAYER_INJECTION_KEY, props.playerId);
  app.mount(pixiApp.stage);

  watch(
    () => [props.width, props.height],
    throttle(() => {
      const width = props.width || pixiApp.renderer.width;
      const height = props.height || pixiApp.renderer.height;
      pixiApp.renderer.resize(width, height);
    }, 50)
  );
});
</script>

<template><canvas ref="canvas" /></template>
