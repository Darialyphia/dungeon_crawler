import { Point, Rectangle } from '@dungeon-crawler/shared';
import { BBox, Collidable, bbox, collidable } from '../../physics/physics.components';
import { ECSEntity } from '../../ecs/ECSEntity';
import { Obstacle, obstacle } from '../map.components';
import { GameZoneState } from '../../../gameZone';
import { Spritable, spritable } from '../../render/render.components';

export type PrefabEntity = ECSEntity & BBox & Obstacle & Collidable & Spritable;

export const createPrefab = (
  state: GameZoneState,
  { x, y, width, height, sprite }: Rectangle & { sprite: string }
): PrefabEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        x: x + 0.501,
        y: y + 0.501,
        width,
        height
      })
    )
    .with(
      obstacle.component({
        isWall: true,
        isWater: false,
        isRendered: true
      })
    )
    .with(collidable.component(true))
    .with(spritable.component({ sprite }))
    .build();

  state.tree.insert(entity);

  return entity;
};
