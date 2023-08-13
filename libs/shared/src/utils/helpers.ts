import type { Point, Size } from '../types/geometry';
import type { AnyFunction, AnyObject, Entries, Matrix } from '../types/utils';

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const random = (max: number) => Math.random() * max;

export const randomInt = (max: number) => Math.round(random(max));

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

export const indexToPoint = (length: number, idx: number): Point => ({
  x: idx % length,
  y: Math.floor(idx / length)
});

type UnionToIntersection<T> = (T extends T ? (p: T) => void : never) extends (
  p: infer U
) => void
  ? U
  : never;
type FromEntries<T extends readonly [PropertyKey, any]> = T extends T
  ? Record<T[0], T[1]>
  : never;
type Flatten<T> = {} & {
  [P in keyof T]: T[P];
};

export function fromEntries<
  V extends PropertyKey,
  T extends [readonly [V, any]] | Array<readonly [V, any]>
>(entries: T): Flatten<UnionToIntersection<FromEntries<T[number]>>> {
  return Object.fromEntries(entries) as any;
}

export const objectEntries = <T extends AnyObject>(obj: T) =>
  Object.entries(obj) as Entries<T>;
