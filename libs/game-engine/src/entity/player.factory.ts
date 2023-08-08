import { randomInt } from '@dungeon-crawler/shared';
import { Player, PlayerId, player } from '../components/player';
import { position, Position } from '../components/position';
import { ECSEntity } from '../ecs/ECSEntity';
import { GameState } from '../gameState';

export type CreatePlayerOptions = {
  id: PlayerId;
};

export type PlayerEntity = ECSEntity & Position & Player;

export const createPlayer = (
  state: GameState,
  { id }: CreatePlayerOptions
): PlayerEntity => {
  const entity = state.world
    .createEntity()
    .with(
      position.component({
        x: randomInt(state.map.width),
        y: randomInt(state.map.height)
      })
    )
    .with(player.component({ id }))
    .build();

  return entity;
};
