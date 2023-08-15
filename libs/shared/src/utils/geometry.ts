import { BBox, Line, Rectangle } from '../types';

export const rectToBBox = (rect: Rectangle): BBox => ({
  ...rect,
  minX: rect.x - rect.width / 2,
  maxX: rect.x + rect.width / 2,
  minY: rect.y - rect.height / 2,
  maxY: rect.y + rect.height / 2
});

export const getRectangleLines = (
  rect: Rectangle
): { top: Line; bottom: Line; left: Line; right: Line } => {
  const bbox = rectToBBox(rect);

  return {
    top: {
      start: { x: bbox.minX, y: bbox.minY },
      end: { x: bbox.maxX, y: bbox.minY }
    },
    bottom: {
      start: { x: bbox.minX, y: bbox.maxY },
      end: { x: bbox.maxX, y: bbox.maxY }
    },
    left: {
      start: { x: bbox.minX, y: bbox.minY },
      end: { x: bbox.minX, y: bbox.maxY }
    },
    right: {
      start: { x: bbox.maxX, y: bbox.minY },
      end: { x: bbox.maxX, y: bbox.maxY }
    }
  };
};
