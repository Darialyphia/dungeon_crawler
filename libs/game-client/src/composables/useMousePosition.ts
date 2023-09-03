import { Point } from '@dungeon-crawler/shared';
import { onTick, useRenderer } from 'vue3-pixi';

export const useMousePosition = () => {
  const renderer = useRenderer();

  const position = ref<Point>({ x: 0, y: 0 });
  onTick(() => {
    // rootPointerEvent private my ass
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootPointer = (renderer.value.events as any).rootPointerEvent.global as Point;
    if (position.value.x !== rootPointer.x || position.value.y !== rootPointer.y) {
      position.value.x = rootPointer.x;
      position.value.y = rootPointer.y;
    }
  });

  return position;
};
