import { Option, some, none, isSome, isNone, fromNullable } from 'fp-ts/Option';

import type { ECSEntity, ECSEntityId } from './ECSEntity';
import type { ECSComponent } from './ECSComponent';
import { type Intersect, pipeBuilder } from '@dungeon-crawler/shared';
import type { BrandsFromComponents } from './types';
import type { ECSSystem, ECSSystemProps } from './ECSSystem';
import { ECSEntityBuilder, entityBuilder } from '../entity/entity.builder';

export interface ECSWorld {
  createEntity(): ECSEntityBuilder<ECSEntity>;
  deleteEntity(e: ECSEntityId): void;
  getEntities(): Iterable<ECSEntity>;
  getEntity<E extends ECSEntity>(id: ECSEntityId): Option<E>;

  addComponent<E extends ECSEntity, C extends ECSComponent<string>>(
    e: E,
    component: () => C
  ): E & C;

  removeComponent<
    E extends ECSEntity,
    C extends string & Exclude<keyof E, keyof ECSEntity>
  >(
    entity: E,
    component: C
  ): Omit<E, keyof C>;

  entitiesByComponent<C extends ECSComponent<string>[]>(
    keys: BrandsFromComponents<C>
  ): Array<ECSEntity & Intersect<C>>;

  addSystem<T extends ECSComponent<string>[]>(
    name: string,
    system: ECSSystem<T>
  ): void;

  removeSystem(name: string): void;

  runSystems(props: ECSSystemProps): void;
}

export type ECSInternals = {
  entities: Map<ECSEntityId, ECSEntity>;
  entityByComponent: Map<string, Set<ECSEntityId>>;
  nextEntityId: ECSEntityId;
  systems: [string, ECSSystem<any>][];
  entitiesBySystem: Map<string, Set<ECSEntityId>>;
};

export function createWorld(): ECSWorld {
  const internals: ECSInternals = {
    entityByComponent: new Map<string, Set<ECSEntityId>>(),
    entities: new Map<ECSEntityId, ECSEntity>(),
    nextEntityId: 0,
    systems: [],
    entitiesBySystem: new Map<string, Set<ECSEntityId>>()
  };

  const world: ECSWorld = {
    createEntity(): ECSEntityBuilder<ECSEntity> {
      return entityBuilder(internals);
    },

    deleteEntity(id: ECSEntityId): void {
      // drop entity
      internals.entities.delete(id);

      // remove from components
      for (const component of internals.entityByComponent.values()) {
        component.delete(id);
      }

      // remove from systems
      for (const system of internals.entitiesBySystem.values()) {
        system.delete(id);
      }
    },

    getEntities() {
      return internals.entities.values();
    },

    getEntity<E extends ECSEntity>(id: ECSEntityId) {
      return fromNullable(internals.entities.get(id) as E);
    },

    addComponent<E extends ECSEntity, C extends ECSComponent<string>>(
      entity: E,
      component: () => C
    ): E & C {
      const c = component();
      const brand = Object.keys(c)[0]!;

      // update entity
      Object.assign(entity, c);

      // add to components
      const set = internals.entityByComponent.get(brand) ?? new Set();
      set.add(entity.entity_id);
      internals.entityByComponent.set(brand, set);

      // add to systems
      internals.systems.forEach(([name, system]) => {
        if (system.target.every(k => k in entity)) {
          internals.entitiesBySystem.get(name)!.add(entity.entity_id);
        }
      });

      return entity as E & C;
    },

    removeComponent(e, component) {
      // update entity
      delete e[component];

      // update components
      internals.entityByComponent.get(component)?.delete(e.entity_id);

      // update systems
      internals.systems.forEach(([name, system]) => {
        if (system.target.some(k => k === component)) {
          internals.entitiesBySystem.get(name)!.delete(e.entity_id);
        }
      });

      return e;
    },

    entitiesByComponent<C extends ECSComponent<string>[]>(
      keys: BrandsFromComponents<C>
    ): (ECSEntity & Intersect<C>)[] {
      if (keys.length === 0) return [];
      const entitySets = keys.map(
        key => internals.entityByComponent.get(key) ?? new Set<ECSEntityId>()
      );
      const entities: (ECSEntity & Intersect<C>)[] = [];
      for (const e of entitySets[0]!) {
        if (entitySets.every(s => s.has(e)))
          entities.push(internals.entities.get(e)! as ECSEntity & Intersect<C>);
      }
      return entities;
    },

    addSystem<T extends ECSComponent<string>[]>(
      name: string,
      system: ECSSystem<T>
    ) {
      if (internals.entitiesBySystem.has(name))
        throw new Error(
          `A system under the name '${name}' is already registered!`
        );

      internals.systems.push([name, system]);
      const targets = world.entitiesByComponent(system.target);
      internals.entitiesBySystem.set(
        name,
        new Set([...targets].map(e => e.entity_id))
      );
    },

    removeSystem(name: string): void {
      internals.systems = internals.systems.filter(([n]) => n !== name);
      internals.entitiesBySystem.delete(name);
    },

    runSystems(props: ECSSystemProps) {
      internals.systems.forEach(([name, system]) => {
        const entities = [
          ...(internals.entitiesBySystem.get(name)?.values() ?? [])
        ]
          .map(e => internals.entities.get(e))
          .filter(e => e !== undefined) as ECSEntity[];
        system.run(world, props, entities);
      });
    }
  };

  return world;
}
