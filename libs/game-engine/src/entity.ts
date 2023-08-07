import { AnyObject, createIndexedArray } from '@dungeon-crawler/shared';
import { z } from 'zod';

export const EntityId = z.string().brand('entityId');
export type EntityId = z.infer<typeof EntityId>;

export type Entity = AnyObject & { id: string };

export const createEntity = () => {
  const entities = createIndexedArray<Entity>([]).addIndex(
    'id',
    entity => entity.id
  );
};
