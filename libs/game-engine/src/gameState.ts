import { IndexedArray, createIndexedArray } from '@dungeon-crawler/shared';
import { Entity } from './entity';

export type GameState = {
  isRunning: boolean;
  entities: IndexedArray<Entity, 'id'>;
};

export const createGameState = (): GameState => {
  const state: GameState = {
    isRunning: false,
    entities: createIndexedArray<Entity>([]).addIndex('id', entity => entity.id)
  };

  return state;
};
