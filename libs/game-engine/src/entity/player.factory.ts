import { randomInt } from '@dungeon-crawler/shared';
import { Player, PlayerId, playerComponent } from '../components/player';
import { positionComponent, Position } from '../components/position';
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
  const player = state.world
    .createEntity()
    .with(
      positionComponent({
        x: randomInt(state.map.width),
        y: randomInt(state.map.height)
      })
    )
    .with(playerComponent({ id }))
    .build();

  return player;
};
