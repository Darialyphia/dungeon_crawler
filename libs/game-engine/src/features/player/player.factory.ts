import { Point, addVector } from '@dungeon-crawler/shared';
import { Player, PlayerId, player } from './player.components';
import {
  BBox,
  Orientation,
  bbox,
  velocity,
  orientation,
  Velocity,
  collidable,
  Collidable,
  updatePosition
} from '../physics/physics.components';
import { ECSEntity } from '../ecs/ECSEntity';
import { GameZoneState } from '../../gameZone';
import {
  Animatable,
  Spritable,
  animatable,
  spritable
} from '../render/render.components';
import { Attacker, attacker } from '../combat/combat.components';
import { characters } from '@dungeon-crawler/resources/src/characters';

export type CreatePlayerOptions = {
  id: PlayerId;
  character: keyof typeof characters;
  position?: Point;
};

export type PlayerEntity = ECSEntity &
  Player &
  BBox &
  Velocity &
  Orientation &
  Collidable &
  Spritable &
  Animatable &
  Attacker;

export const createPlayer = (
  state: GameZoneState,
  options: CreatePlayerOptions
): PlayerEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        //fixes artifact on map tiles
        ...addVector(state.map.getEntrance(), { x: 0.501, y: 0.501 }),
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
    .with(player.component({ id: options.id, character: options.character }))
    .with(animatable.component({ state: 'idle' }))
    .with(collidable.component(true))
    .with(spritable.component({ sprite: options.character }))
    .with(attacker.component(true))
    .build();

  state.tree.insert(entity);
  if (options.position) {
    entity.bbox = updatePosition(entity.bbox, options.position);
  }

  return entity;
};
