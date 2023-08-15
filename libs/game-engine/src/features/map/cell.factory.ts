import { Point } from '@dungeon-crawler/shared';
import { GameState } from '../../gameState';
import { BBox, bbox } from '../physics/physics.components';
import { ECSEntity } from '../ecs/ECSEntity';
import { CELL_TYPES, CellType } from './map.factory';
import { obstacle } from './map.components';

export type CellEntity = ECSEntity & BBox;

export const createCell = (
  state: GameState,
  { x, y, type }: Point & { type: CellType }
): CellEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        x: x + 0.5,
        y: y + 0.5,
        width: 1,
        height: 1
      })
    )
    .with(
      obstacle.component({
        isWall: type === CELL_TYPES.WATER,
        isWater: type === CELL_TYPES.WATER
      })
    )
    .build();

  state.tree.insert(entity);

  return entity;
};
