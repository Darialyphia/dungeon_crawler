import { Nullable, Point, clamp, lerp } from "@dungeon-crawler/shared";
import { InjectionKey } from "vue";
import { useSafeInject } from "./useSafeInject";
import { throttle } from "lodash-es";
import { useScreen } from "vue3-pixi";
import { Container } from "pixi.js";
import { CELL_SIZE } from "../utils/constants";
import { useGameState } from "./useGameState";

export type Camera = {
  position: Readonly<Ref<Point>>;
  centerOn(point: Point): void;
};

export const CAMERA_INJECTION_KEY = Symbol("camera") as InjectionKey<Camera>;

export const useCameraProvider = (container: Ref<Nullable<Container>>) => {
  const screen = useScreen();
  const position = ref({
    x: screen.value.width / 2,
    y: screen.value.height / 2,
  });

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
    centerOn({ x, y }) {
      if (!container.value) return;

      const { width, height } = screen.value;
      const { scale } = container.value;
      const { map } = state.value.snapshot;

      const newPivot = {
        x: lerp(1, [container.value.pivot.x, x]),
        y: lerp(1, [container.value.pivot.y, y]),
      };

      const halfScreenWidth = width / 2 / scale.x;
      const halfScreenHeight = height / 2 / scale.y;

      container.value.pivot.set(
        clamp(
          newPivot.x,
          halfScreenWidth,
          map.width * CELL_SIZE - halfScreenWidth
        ),
        clamp(
          newPivot.y,
          halfScreenHeight,
          map.height * CELL_SIZE - halfScreenHeight
        )
      );
    },
  };

  provide(CAMERA_INJECTION_KEY, api);

  return api;
};

export const useCamera = () => useSafeInject(CAMERA_INJECTION_KEY);
