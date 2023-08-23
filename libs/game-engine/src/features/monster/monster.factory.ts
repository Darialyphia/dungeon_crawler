import { addVector } from '@dungeon-crawler/shared';
import {
  BBox,
  Orientation,
  bbox,
  velocity,
  orientation,
  Velocity,
  collidable,
  Collidable
} from '../physics/physics.components';
import { ECSEntity } from '../ecs/ECSEntity';
import { GameZoneState } from '../../gameZone';
import {
  Spritable,
  spritable,
  Animatable,
  animatable
} from '../render/render.components';
import { Monster, monster } from './monster.components';
import { characters } from '@dungeon-crawler/resources/src/characters';

export type CreateMonsterOptions = {
  sprite: keyof typeof characters;
};

export type MonsterEntity = ECSEntity &
  Monster &
  Animatable &
  BBox &
  Velocity &
  Orientation &
  Collidable &
  Spritable;

export const createMonster = (
  state: GameZoneState,
  options: CreateMonsterOptions
): MonsterEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        //fixes artifact on map tiles
        ...addVector(state.map.getValidSpawnPoint(), { x: 0.501, y: 0.501 }),
        width: 1,
        height: 1
      })
    )
    .with(
      velocity.component({
        target: { x: 0, y: 0 },
        speed: 6
      })
    )
    .with(orientation.component('right'))
    .with(collidable.component(true))
    .with(monster.component({ character: options.sprite }))
    .with(spritable.component({ sprite: options.sprite }))
    .with(animatable.component({ state: 'idle' }))
    .build();

  state.tree.insert(entity);

  return entity;
};
