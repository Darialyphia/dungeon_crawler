import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

/**
 * Player Component
 */

export type PlayerId = string;
import { Character, characters } from '@dungeon-crawler/resources/src/characters';

export const player = defineECSComponent<
  'player',
  { id: PlayerId; character: Character },
  { id: PlayerId; character: keyof typeof characters }
>('player', player => ({ id: player.id, character: characters[player.character] }));
export type Player = inferComponent<typeof player>;

export const getPlayerById = <T extends ECSComponent<string>[] = []>(id: PlayerId) =>
  player.findFirst<T>(entity => entity.player.id === id);
