<script setup lang="ts">
import { parse } from "zipson";
import {
  Application,
  Assets,
  BaseTexture,
  SCALE_MODES,
  extensions,
} from "pixi.js";
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
import { assetsManifest } from "./assets-manifest";
import { spriteSheetParser } from "./utils/spritesheet-parser";
import { WRAP_MODES } from "pixi.js";
import {
  DEBUG_OPTIONS_INJECTION_KEY,
  useDebugOptionsProvider,
} from "./composables/useDebugOptions";

const props = defineProps<{
  width: number;
  height: number;
  playerId: string;
  state: string;
}>();

const emit = defineEmits<{
  "game:event": [DispatcherArg];
}>();

const parsedState = computed<SerializedGameState>(() =>
  parse(props.state as unknown as string)
);
const gameState = useGameStateProvider(parsedState);
const dispatch = useDispatchProvider((arg) => emit("game:event", arg));
const options = useDebugOptionsProvider();
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

  if (import.meta.env.DEV) {
    // @ts-ignore  enable PIXI devtools
    window.__PIXI_APP__ = pixiApp;
  }

  BaseTexture.defaultOptions.wrapMode = WRAP_MODES.CLAMP;
  BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
  extensions.add(spriteSheetParser);
  Assets.init({ manifest: assetsManifest });
  const app = createApp(PixiApp);
  app.provide(appInjectKey, pixiApp);
  app.provide(GAME_STATE_INJECTION_KEY, gameState);
  app.provide(DISPATCHER_INJECTION_KEY, dispatch);
  app.provide(CURRENT_PLAYER_INJECTION_KEY, props.playerId);
  app.provide(DEBUG_OPTIONS_INJECTION_KEY, options);
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

<template>
  <div class="container">
    <canvas ref="canvas" />
    <div class="debug-options">
      <label
        ><input v-model="options.mapCoords" type="checkbox" />Display map
        coordinates
      </label>
      <label
        ><input v-model="options.mapBitmask" type="checkbox" />Display map
        bitmask
      </label>
      <label>
        <input v-model="options.obstacles" type="checkbox" />Display nearby
        obstacles</label
      >
      <label
        ><input v-model="options.obstaclesMinkowski" type="checkbox" />Display
        nearby obstacles Minkowski sum</label
      >
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: monospace;
  width: v-bind(width);
  height: v-bind(height);
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto 1fr auto;
  place-items: center;
}

canvas {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
}

.debug-options {
  width: max-content;
  grid-column: 3;
  grid-row: 1;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 1rem;
}

.debug-options > label {
  display: block;
}
</style>
