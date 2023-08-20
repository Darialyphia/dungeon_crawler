import type { Point } from '@dungeon-crawler/shared';
import type { Noise2D } from 'open-simplex-noise/lib/2d';
import { makeNoise2D } from 'open-simplex-noise';
import { MapGenerator } from '../types';

export type NoiseRectangleOptions<T> = {
  width: number;
  height: number;
  startsAt: Point;
  amplitude: number;
  frequency: number;
  octaves: number;
  persistence: number;
  scale: (val: Point & { value: number }) => T;
};

export const makeNoiseRectangle = <T>(
  noise: Noise2D,
  {
    startsAt,
    width,
    height,
    amplitude,
    frequency,
    octaves,
    persistence,
    scale
  }: NoiseRectangleOptions<T>
): T[][] => {
  const field: T[][] = Array.from({ length: height });
  for (let y = 0; y < height; y++) {
    field[y] = Array.from({ length: width });
    for (let x = 0; x < width; x++) {
      let value = 0;
      for (let octave = 0; octave < octaves; octave++) {
        const freq = frequency * Math.pow(2, octave);
        const n = noise((startsAt.x + x) * freq, (startsAt.y + y) * freq);

        value += n * (amplitude * Math.pow(persistence, octave));
      }

      field[y][x] = scale({
        x: startsAt.x + x,
        y: startsAt.y + y,
        value: value / (2 - 1 / Math.pow(2, octaves - 1))
      });
    }
  }
  return field;
};

export type NoiseGeneratorOptions<T> = {
  seed: number;
  frequency?: number;
  octaves?: number;
  amplitude?: number;
  persistence?: number;
  scale: (val: Point & { value: number }) => T;
};
export const createNoiseGenerator = <T>({
  seed,
  scale,
  frequency = 0.1,
  octaves = 3,
  amplitude = 4,
  persistence = 0.2
}: NoiseGeneratorOptions<T>): MapGenerator<T> => {
  return {
    getChunk({ width, height, startsAt }) {
      return makeNoiseRectangle(makeNoise2D(seed), {
        startsAt,
        width,
        height,
        frequency,
        octaves,
        scale,
        amplitude,
        persistence
      }).flat();
    }
  };
};
