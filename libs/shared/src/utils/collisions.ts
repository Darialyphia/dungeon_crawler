import { dist, fastDistCheck } from './math';
import type { BBox, Circle, Line, Point, Rectangle } from '../types';

export const pointRectCollision = (point: Point, rect: Rectangle) =>
  point.x >= rect.x &&
  point.x <= rect.x + rect.width &&
  point.y >= rect.y &&
  point.y <= rect.y + rect.height;

export const pointCircleCollision = (point: Point, circle: Circle) =>
  fastDistCheck(point, circle, circle.r);

export const circleRectCollision = (circle: Circle, rect: Rectangle) => {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.r) {
    return false;
  }
  if (distY > rect.height / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.width / 2) {
    return true;
  }
  if (distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;

  return dx * dx + dy * dy <= circle.r * circle.r;
};

export const rectRectCollision = (rect1: Rectangle, rect2: Rectangle) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y
  );
};

export const getIntersectionRect = (r1: Rectangle, r2: Rectangle) => {
  var x = Math.max(r1.x, r2.x);
  var y = Math.max(r1.y, r2.y);
  var xx = Math.min(r1.x + r1.width, r2.x + r2.width);
  var yy = Math.min(r1.y + r1.height, r2.y + r2.height);

  return { x: x, y: y, width: xx - x, height: yy - y };
};

export const lineRectIntersectionPoints = (line: Line, bbox: BBox) => {
  const { minX, maxX, minY, maxY } = bbox;
  let t0 = 0;
  let t1 = 1;

  const dx = line.end.x - line.start.x;
  const dy = line.end.y - line.start.y;

  for (var edge = 0; edge < 4; edge++) {
    let p: number;
    let q: number;
    // Traverse through left, right, bottom, top edges.
    if (edge === 0) {
      p = -dx;
      q = -(minX - line.start.x);
    } else if (edge === 1) {
      p = dx;
      q = maxX - line.start.x;
    } else if (edge === 2) {
      p = -dy;
      q = -(minY - line.start.y);
    } else {
      p = dy;
      q = maxY - line.start.y;
    }

    const r = q / p;

    if (p === 0 && q < 0) return []; // Don't draw line at all. (parallel line outside)

    if (p < 0) {
      if (r > t1) return []; // Don't draw line at all.
      else if (r > t0) t0 = r; // Line is clipped!
    } else if (p > 0) {
      if (r < t0) return []; // Don't draw line at all.
      else if (r < t1) t1 = r; // Line is clipped!
    }
  }

  return [
    { x: line.start.x + t0 * dx, y: line.start.y + t0 * dy },
    { x: line.start.x + t1 * dx, y: line.start.y + t1 * dy }
  ];
};
