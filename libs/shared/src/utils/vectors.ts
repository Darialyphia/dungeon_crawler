import { rad2Deg } from './math';
import type { Point } from '../types/geometry';
import { isNumber } from './assertions';

export type AngleInDegrees = number;

export const addVector = (vec1: Point, vec2: Point | number) => {
  if (isNumber(vec2)) {
    return {
      x: vec1.x + vec2,
      y: vec1.y + vec2
    };
  }

  return {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y
  };
};

export const subVector = (vec1: Point, vec2: Point | number) => {
  if (isNumber(vec2)) {
    return {
      x: vec1.x - vec2,
      y: vec1.y - vec2
    };
  }

  return {
    x: vec1.x - vec2.x,
    y: vec1.y - vec2.y
  };
};

export const mulVector = (vec1: Point, vec2: Point | number) => {
  if (isNumber(vec2)) {
    return {
      x: vec1.x * vec2,
      y: vec1.y * vec2
    };
  }

  return {
    x: vec1.x * vec2.x,
    y: vec1.y * vec2.y
  };
};

export const divVector = (vec1: Point, vec2: Point | number) => {
  if (isNumber(vec2)) {
    return {
      x: vec1.x / vec2,
      y: vec1.y / vec2
    };
  }

  return {
    x: vec1.x / vec2.x,
    y: vec1.y / vec2.y
  };
};

export const toAngle = (vec: Point): AngleInDegrees => {
  const radians = Math.atan2(vec.y, vec.x);

  return (360 + Math.round(rad2Deg(radians))) % 360;
};

export const normalizeVector = ({ x, y }: Point) => {
  const len = Math.hypot(x, y);

  return len === 0 ? { x: 0, y: 0 } : { x: x / len, y: y / len };
};

export const setMagnitude = (vec: Point, speed: number) => {
  return mulVector(normalizeVector(vec), speed);
};

export const getMagnitude = (vec: Point) => {
  return Math.sqrt(vec.x ** 2 + vec.y ** 2);
};
