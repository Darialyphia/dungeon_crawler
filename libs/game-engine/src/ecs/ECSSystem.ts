import type { ECSComponent } from './ECSComponent';
import type { Intersect } from '@dungeon-crawler/shared';
import type { ECSEntity } from './ECSEntity';
import type { BrandsFromComponents } from './types';
import type { ECSWorld } from './ECSWorld';

export type ECSSystemProps = {
  readonly delta: number;
};

export interface ECSSystem<Cs extends ECSComponent<string>[]> {
  readonly target: BrandsFromComponents<Cs>;
  readonly run: (
    world: ECSWorld,
    props: ECSSystemProps,
    entities: (ECSEntity & Intersect<Cs>)[]
  ) => void;
}
