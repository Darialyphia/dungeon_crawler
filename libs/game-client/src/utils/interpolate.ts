import { Nullable, Point, lerp } from "@dungeon-crawler/shared";

export type InterPolationState = {
  position: Point;
  t: number;
};

export type InterpolateOptions = {
  now?: number;
};

export const interpolatePosition = (
  newState: InterPolationState,
  oldState: Nullable<InterPolationState>
): Point => {
  if (!oldState) return newState.position;
  if (newState.t === oldState.t) return newState.position;

  const delta = new Date().getTime() - newState.t;
  const statesDelta = newState.t - oldState.t;

  const ratio = delta / statesDelta;
  const result = {
    x: lerp(ratio, [oldState.position.x, newState.position.x]),
    y: lerp(ratio, [oldState.position.y, newState.position.y]),
  };

  return result;
};
