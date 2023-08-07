import { Point } from '@dungeon-crawler/shared';
import type { ECSComponent } from '../ecs/ECSComponent';

import { ecsComponent, has } from '../ecs/ECSComponent';

export const PositionBrand = 'position';
type PositionBrand = typeof PositionBrand;
export type Position = ECSComponent<PositionBrand, Point>;

export const hasPosition = has<Position>('position');
export const positionComponent = ecsComponent<Position>('position');
