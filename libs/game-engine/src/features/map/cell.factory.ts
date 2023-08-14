import { Point } from '@dungeon-crawler/shared';
import { GameState } from '../../gameState';
import { BBox, bbox } from '../physics/physics.components';
import { ECSEntity } from '../ecs/ECSEntity';

export type CellEntity = ECSEntity & BBox;

export const createCell = (state: GameState, { x, y }: Point): CellEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        x,
        y,
        width: 1,
        height: 1
      })
    )
    .build();

  state.tree.insert(entity.bbox);

  return entity;
};
