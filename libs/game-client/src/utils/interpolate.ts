import { Point, lerp } from "@dungeon-crawler/shared";

export type InterPolationState<T extends Point> = {
  value: T;
  t: number;
};

export type InterpolateOptions = {
  now?: number;
};

export const interpolate = <T extends Point = Point>(
  newState: InterPolationState<T>,
  oldState: InterPolationState<T>,
  { now = performance.now() }: InterpolateOptions = {}
): Point => {
  const delta = now - newState.t;
  const statesDelta = newState.t - oldState.t;
  const ratio = delta / statesDelta;

  return {
    x: lerp(ratio, [oldState.value.x, newState.value.x]),
    y: lerp(ratio, [oldState.value.y, newState.value.y]),
  };
};
