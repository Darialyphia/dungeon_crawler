import { Point } from '@dungeon-crawler/shared';
import { defineECSComponent, inferComponent } from '../utils';

export const position = defineECSComponent<'position', Point>('position');
export type Position = inferComponent<typeof position>;
