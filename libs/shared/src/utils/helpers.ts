import type { Point, Size } from '../types/geometry';
import type { AnyFunction, Matrix } from '../types/utils';

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const random = (max: number) => Math.random() * max;

export const randomInt = (max: number) => Math.round(random(max));

export const createMatrix = <T>(
  dimensions: Size,
  initialValue: (point: Point) => T
): Matrix<T> =>
  Array.from({ length: dimensions.h }, (_, x) =>
    Array.from({ length: dimensions.w }, (_, y) => initialValue({ x, y }))
  );

type Curry<Fn extends AnyFunction> = Parameters<Fn> extends [
  infer FirstArg,
  ...infer Rest
]
  ? (arg: FirstArg) => Curry<(...args: Rest) => ReturnType<Fn>>
  : ReturnType<Fn>;

export function curry<T extends AnyFunction, TAgg extends unknown[]>(
  func: T,
  agg?: TAgg
): Curry<T> {
  const aggregatedArgs = agg ?? [];
  if (func.length === aggregatedArgs.length) return func(...aggregatedArgs);
  return ((arg: any) => curry(func, [...aggregatedArgs, arg])) as any;
}
