import { dist, fastDistCheck } from './math';
import type { BBox, Circle, Line, Nullable, Point, Rectangle } from '../types';
import { getRectangleLines, rectToBBox } from './geometry';
import { isDefined } from './assertions';

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

export const lineRectCollision = (line: Line, rect: Rectangle) => {
  var x1 = line.start.x;
  var y1 = line.start.x;

  var x2 = line.end.x;
  var y2 = line.end.y;

  const bbox = rectToBBox(rect);
  var bx1 = bbox.minX;
  var by1 = bbox.minY;
  var bx2 = bbox.maxX;
  var by2 = bbox.maxY;

  var t = 0;

  //  If the start or end of the line is inside the rect then we assume
  //  collision, as rects are solid for our use-case.

  if (
    (x1 >= bx1 && x1 <= bx2 && y1 >= by1 && y1 <= by2) ||
    (x2 >= bx1 && x2 <= bx2 && y2 >= by1 && y2 <= by2)
  ) {
    return true;
  }

  if (x1 < bx1 && x2 >= bx1) {
    //  Left edge
    t = y1 + ((y2 - y1) * (bx1 - x1)) / (x2 - x1);

    if (t > by1 && t <= by2) {
      return true;
    }
  } else if (x1 > bx2 && x2 <= bx2) {
    //  Right edge
    t = y1 + ((y2 - y1) * (bx2 - x1)) / (x2 - x1);

    if (t >= by1 && t <= by2) {
      return true;
    }
  }

  if (y1 < by1 && y2 >= by1) {
    //  Top edge
    t = x1 + ((x2 - x1) * (by1 - y1)) / (y2 - y1);

    if (t >= bx1 && t <= bx2) {
      return true;
    }
  } else if (y1 > by2 && y2 <= by2) {
    //  Bottom edge
    t = x1 + ((x2 - x1) * (by2 - y1)) / (y2 - y1);

    if (t >= bx1 && t <= bx2) {
      return true;
    }
  }

  return false;
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

export const lineLineIntersection = (
  line1: Line,
  line2: Line
): Nullable<Point> => {
  const x1 = line1.start.x;
  const y1 = line1.start.y;
  const x2 = line1.end.x;
  const y2 = line1.end.y;

  const x3 = line2.start.x;
  const y3 = line2.start.y;
  const x4 = line2.end.x;
  const y4 = line2.end.y;

  //  Check that none of the lines are length zero
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const isParallel = denom === 0;
  //  Make sure there is not a division by zero - this also indicates that the lines are parallel.
  //  If numA and numB were both equal to zero the lines would be on top of each other (coincidental).
  //  This check is not done because it is not necessary for this implementation (the parallel check accounts for this).

  if (isParallel) return null;

  //  Calculate the intermediate fractional point that the lines potentially intersect.

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  //  The fractional point will be between 0 and 1 inclusive if the lines intersect.
  //  If the fractional calculation is larger than 1 or smaller than 0 the lines would need to be longer to intersect.

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;

  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1)
  };
};

export const lineRectIntersection = (line: Line, bbox: BBox): Point[] => {
  if (!lineRectCollision(line, bbox)) return [];

  const { top, bottom, left, right } = getRectangleLines(bbox);

  return [
    lineLineIntersection(line, top),
    lineLineIntersection(line, bottom),
    lineLineIntersection(line, left),
    lineLineIntersection(line, right)
  ].filter(isDefined);
};
