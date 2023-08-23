import { Character, characters } from '@dungeon-crawler/resources/src/characters';
import { defineECSComponent, inferComponent } from '../../utils';
import { ECSComponent } from '../ecs/ECSComponent';

export const monster = defineECSComponent<
  'monster',
  { character: Character },
  { character: keyof typeof characters }
>('monster', ({ character }) => ({ character: characters[character] }));
export type Monster = inferComponent<typeof monster>;
