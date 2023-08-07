import { pipeBuilder } from '@dungeon-crawler/shared';
import { ECSComponent } from '../ecs/ECSComponent';
import { ECSEntity } from '../ecs/ECSEntity';
import { ECSInternals } from '../ecs/ECSWorld';

/**
 * Mutably changes the entity by adding the component to it
 */
function addComponent<E extends ECSEntity, C extends ECSComponent<string>>(
  entity: E,
  component: () => C
): E & C {
  return Object.assign(entity, component()) as E & C;
}

export type ECSEntityBuilder<T extends ECSEntity> = {
  with<C extends ECSComponent<string>>(
    component: () => C
  ): ECSEntityBuilder<T & C>;
  build(): T;
};

function entityBuilder<T extends ECSEntity>(
  internals: ECSInternals,
  builder = pipeBuilder<ECSEntity, T>((e: ECSEntity) => e as T)
): ECSEntityBuilder<T> {
  return {
    with<C extends ECSComponent<string>>(
      component: () => C
    ): ECSEntityBuilder<T & C> {
      return entityBuilder(
        internals,
        builder.then(e => addComponent(e, component))
      );
    },
    build(): T {
      const e = builder.build({ entity_id: internals.nextEntityId++ } as T);
      type exclude = keyof ECSEntity;
      // add to entities
      internals.entities.set(e.entity_id, e);

      // add to component trackers
      Object.keys(e).forEach(key => {
        if (key !== ('entity_id' satisfies exclude)) {
          const set = internals.entityByComponent.get(key) ?? new Set();
          set.add(e.entity_id);
          internals.entityByComponent.set(key, set);
        }
      });
      // add to system trackers
      internals.systems.forEach(([name, system]) => {
        if (system.target.every(brand => brand in e)) {
          internals.entitiesBySystem.get(name)!.add(e.entity_id);
        }
      });
      return e;
    }
  };
}
