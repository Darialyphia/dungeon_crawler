import {
  Nullable,
  Point,
  Rectangle,
  clamp,
  lerp,
} from "@dungeon-crawler/shared";
import { InjectionKey } from "vue";
import { useSafeInject } from "./useSafeInject";
import { throttle } from "lodash-es";
import { useScreen } from "vue3-pixi";
import { CELL_SIZE } from "../utils/constants";
import { useGameState } from "./useGameState";
import { Container } from "pixi.js";
import { useStableRef } from "./useStableRef";

export type Camera = {
  position: Readonly<Ref<Point>>;
  scale: Readonly<Ref<number>>;
  pivot: Readonly<Ref<Point>>;
  viewport: ComputedRef<Rectangle>;
  centerOn(point: Point): void;
};

export const CAMERA_INJECTION_KEY = Symbol("camera") as InjectionKey<Camera>;

export const useCameraProvider = (container: Ref<Nullable<Container>>) => {
  const screen = useScreen();
  const position = ref({
    x: screen.value.width / 2,
    y: screen.value.height / 2,
  });
  const scale = ref(2);

  const pivot = useStableRef(
    {
      x: screen.value.width / 2,
      y: screen.value.height / 2,
    },
    ["x", "y"]
  );

  const viewport = computed(() => ({
    x: pivot.value.x - screen.value.width / 2,
    y: pivot.value.y - screen.value.height / 2,
    width: screen.value.width,
    height: screen.value.height,
  }));

  const setPosition = throttle(() => {
    position.value = {
      x: screen.value.width / 2,
      y: screen.value.height / 2,
    };
  }, 50);

  useEventListener(window, "resize", setPosition);

  const { state } = useGameState();
  const api: Camera = {
    position: readonly(position),
    scale: readonly(scale),
    pivot: readonly(pivot),
    viewport,

    centerOn({ x, y }) {
      if (!container.value) return;
      const { width, height } = screen.value;
      const { map } = state.value.snapshot;

      const newPivot = {
        x: lerp(1, [pivot.value.x, x]),
        y: lerp(1, [pivot.value.y, y]),
      };

      const halfScreenWidth = width / 2 / scale.value;
      const halfScreenHeight = height / 2 / scale.value;

      pivot.value = {
        x: clamp(
          newPivot.x,
          halfScreenWidth,
          map.width * CELL_SIZE - halfScreenWidth
        ),
        y: clamp(
          newPivot.y,
          halfScreenHeight,
          map.height * CELL_SIZE - halfScreenHeight
        ),
      };

      container.value.pivot.set(pivot.value.x, pivot.value.y);
    },
  };

  provide(CAMERA_INJECTION_KEY, api);

  return api;
};

export const useCamera = () => useSafeInject(CAMERA_INJECTION_KEY);
