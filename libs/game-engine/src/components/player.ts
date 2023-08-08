import { ECSComponent } from '../ecs/ECSComponent';
import { defineECSComponent, inferComponent } from '../utils';

export type PlayerId = string;

export const player = defineECSComponent<'player', { id: PlayerId }>('player');
export type Player = inferComponent<typeof player>;

export const getPlayerById = <T extends ECSComponent<string>[] = []>(
  id: PlayerId
) => player.findFirst<T>(entity => entity.player.id === id);
