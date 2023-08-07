import { Point } from '@dungeon-crawler/shared';
import type { ECSComponent } from '../ecs/ECSComponent';

import { ecsComponent, has } from '../ecs/ECSComponent';

export type PlayerId = string;
export const PlayerBrand = 'player';
type PlayerBrand = typeof PlayerBrand;
export type Player = ECSComponent<PlayerBrand, { id: PlayerId }>;

export const hasPlayer = has<Player>(PlayerBrand);
export const playerComponent = ecsComponent<Player>(PlayerBrand);
