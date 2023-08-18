import {
  Nullable,
  Point,
  Rectangle,
  clamp,
  lerp,
  rectToBBox
} from '@dungeon-crawler/shared';
import { InjectionKey } from 'vue';
import { useSafeInject } from './useSafeInject';
import { throttle } from 'lodash-es';
import { useScreen } from 'vue3-pixi';
import { CELL_SIZE } from '../utils/constants';
import { useGameState } from './useGameState';
import { Container } from 'pixi.js';
import { useStableRef } from './useStableRef';
import { useCurrentPlayer } from './useCurrentPlayer';

export type Camera = {
  position: Readonly<Ref<Point>>;
  scale: Readonly<Ref<number>>;
  pivot: Readonly<Ref<Point>>;
  viewport: ComputedRef<Rectangle>;
  centerOn(point: Point): void;
};

export const CAMERA_INJECTION_KEY = Symbol('camera') as InjectionKey<Camera>;

export const useCameraProvider = (container: Ref<Nullable<Container>>) => {
  const currentPlayer = useCurrentPlayer();
  const { state } = useGameState();
  const screen = useScreen();

  const position = ref({
    x: screen.value.width / 2,
    y: screen.value.height / 2
  });
  const scale = ref(2);

  useEventListener(document, 'wheel', e => {
    const diff = -e.deltaY / 1000;
    scale.value = clamp(scale.value + diff, 1, 3);
  });

  const clampPivot = ({ x, y }: Point) => {
    const { width, height } = screen.value;
    const { map } = state.value.snapshot;
    const halfW = width / 2 / scale.value;
    const halfH = height / 2 / scale.value;
    return {
      x: clamp(x, halfW, map.width * CELL_SIZE - halfW),
      y: clamp(y, halfH, map.height * CELL_SIZE - halfH)
    };
  };

  const pivot = useStableRef(clampPivot(currentPlayer.value?.bbox ?? { x: 0, y: 0 }), [
    'x',
    'y'
  ]);

  const viewport = computed(() =>
    rectToBBox({
      x: pivot.value.x,
      y: pivot.value.y,
      width: screen.value.width / scale.value,
      height: screen.value.height / scale.value
    })
  );

  const setPosition = throttle(() => {
    position.value = {
      x: screen.value.width / 2,
      y: screen.value.height / 2
    };
  }, 50);

  useEventListener(window, 'resize', setPosition);

  const api: Camera = {
    position: readonly(position),
    scale: readonly(scale),
    pivot: readonly(pivot),
    viewport,

    centerOn({ x, y }) {
      if (!container.value) return;

      const newPivot = {
        x: lerp(1, [pivot.value.x, x]),
        y: lerp(1, [pivot.value.y, y])
      };

      pivot.value = clampPivot(newPivot);
    }
  };

  provide(CAMERA_INJECTION_KEY, api);

  return api;
};

export const useCamera = () => useSafeInject(CAMERA_INJECTION_KEY);
