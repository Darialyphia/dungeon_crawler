import { addVector, randomInt } from '@dungeon-crawler/shared';
import { Player, PlayerId, PlayerState, player, playerState } from './player.components';
import { GameState, GameZoneState } from '../../gameState';
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

export type CreatePlayerOptions = {
  id: PlayerId;
};

export type PlayerEntity = ECSEntity &
  Player &
  PlayerState &
  BBox &
  Velocity &
  Orientation &
  Collidable;

export const createPlayer = (
  state: GameZoneState,
  { id }: CreatePlayerOptions
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
    .with(player.component({ id }))
    .with(playerState.component('idle'))
    .with(collidable.component(true))
    .build();

  state.tree.insert(entity);

  return entity;
};
