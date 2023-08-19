import { AnyZodObject } from 'zod';
import { GameEventHandler } from './emitter';
import { Intersect } from '@dungeon-crawler/shared';
import * as O from 'fp-ts/Option';
import type { ECSComponent } from './features/ecs/ECSComponent';

import { ecsComponent, has } from './features/ecs/ECSComponent';
import {
  BrandFromComponent,
  BrandsFromComponents,
  ECSComponentProps
} from './features/ecs/types';
import { ECSWorld } from './features/ecs/ECSWorld';
import { ECSEntity } from './features/ecs/ECSEntity';

export const defineEventHandler = <T extends AnyZodObject>(
  handler: GameEventHandler<T>
) => handler;

type ComponentPredicate<
  TType extends {},
  TName extends string,
  TBrands extends ECSComponent<string>[] = []
> = (entity: ComponentFindResult<TType, TName, TBrands>) => boolean;

type ComponentFindResult<
  TType extends {},
  TName extends string,
  TBrands extends ECSComponent<string>[] = []
> = TBrands extends []
  ? ECSEntity & ECSComponent<TName, TType>
  : ECSEntity & ECSComponent<TName, TType> & Intersect<TBrands>;

type Component<TType extends {}, TName extends string, TInit extends {} = TType> = {
  readonly _type: ECSComponent<TName, TType>;

  brand: BrandFromComponent<ECSComponent<TName, TType>>;

  component(init: TInit): () => ECSComponent<TName, TType>;

  has: ReturnType<typeof has<ECSComponent<TName, TType>>>;

  findAll: <TBrands extends ECSComponent<string>[] = []>(
    world: ECSWorld,
    otherBrands?: BrandsFromComponents<TBrands>
  ) => Array<ComponentFindResult<TType, TName, TBrands>>;

  findBy: <TBrands extends ECSComponent<string>[] = []>(
    predicate: ComponentPredicate<TType, TName, TBrands>
  ) => (
    world: ECSWorld,
    otherBrands?: BrandsFromComponents<TBrands>
  ) => Array<ComponentFindResult<TType, TName, TBrands>>;

  findFirst: <TBrands extends ECSComponent<string>[] = []>(
    predicate: ComponentPredicate<TType, TName, TBrands>
  ) => (
    world: ECSWorld,
    otherBrands?: BrandsFromComponents<TBrands>
  ) => O.Option<ComponentFindResult<TType, TName, TBrands>>;
};

export const defineECSComponent = <
  TName extends string,
  TType extends {},
  TInit extends {} = TType
>(
  name: TName,
  init: (input: TInit) => ECSComponentProps<ECSComponent<TName, TType>>
): Component<TType, TName, TInit> => {
  type Component = ECSComponent<TName, TType>;
  type Brand = BrandFromComponent<Component>;

  const brand = name as unknown as Brand;
  const hasComponent = has<Component>(brand);
  const component = ecsComponent<Component>(brand);

  return {
    brand,
    component(input) {
      return component(init(input)) as () => ECSComponent<TName, TType>;
    },
    has: hasComponent,
    findAll(world, otherBrands?) {
      return world.entitiesByComponent([brand, ...(otherBrands ?? [])]);
    },
    findBy(predicate) {
      return (world, otherBrands) =>
        world.entitiesByComponent([brand, ...(otherBrands ?? [])]).filter(predicate);
    },
    findFirst(predicate) {
      return (world, otherBrands) => {
        const result = world
          .entitiesByComponent([brand, ...(otherBrands ?? [])])
          .filter(predicate);

        return O.fromNullable(result[0]);
      };
    },
    get _type() {
      console.warn(
        "don't access a component _type property, it is only here for inference purpose"
      );
      return undefined as unknown as Component;
    }
  };
};

export type inferComponent<T extends Component<{}, any>> = T['_type'];
