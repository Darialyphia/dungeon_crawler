import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

/**
 * Player Component
 */

export type PlayerId = string;

export const player = defineECSComponent<'player', { id: PlayerId }>(
  'player',
  player => player
);
export type Player = inferComponent<typeof player>;

export const getPlayerById = <T extends ECSComponent<string>[] = []>(id: PlayerId) =>
  player.findFirst<T>(entity => entity.player.id === id);
