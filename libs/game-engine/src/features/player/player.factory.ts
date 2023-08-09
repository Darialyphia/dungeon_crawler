import { randomInt } from '@dungeon-crawler/shared';
import { Player, PlayerId, player } from './player.components';
import { GameState } from '../../gameState';
import { BBox, bbox, velocity } from '../physics/physics.components';
import { ECSEntity } from '../ecs/ECSEntity';

export type CreatePlayerOptions = {
  id: PlayerId;
};

export type PlayerEntity = ECSEntity & BBox & Player;

export const createPlayer = (
  state: GameState,
  { id }: CreatePlayerOptions
): PlayerEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        x: randomInt(state.map.width),
        y: randomInt(state.map.height),
        w: 1,
        h: 1
      })
    )
    .with(
      velocity.component({
        target: {
          x: 0,
          y: 0
        },
        speed: 20
      })
    )
    .with(player.component({ id }))
    .build();

  return entity;
};
