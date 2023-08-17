import { randomInt } from '@dungeon-crawler/shared';
import { Player, PlayerId, PlayerState, player, playerState } from './player.components';
import { GameState } from '../../gameState';
import {
  BBox,
  Orientation,
  bbox,
  velocity,
  orientation,
  Velocity
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
  Orientation;

export const createPlayer = (
  state: GameState,
  { id }: CreatePlayerOptions
): PlayerEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        ...state.map.getValidSpawnPoint(),
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
    .build();

  state.tree.insert(entity);

  return entity;
};
