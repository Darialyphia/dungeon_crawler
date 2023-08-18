import { Point } from '@dungeon-crawler/shared';
import { GameState } from '../../../gameState';
import { BBox, bbox } from '../../physics/physics.components';
import { ECSEntity } from '../../ecs/ECSEntity';
import { Portal, portal } from '../map.components';
import { Interactive, interactive } from '../../interaction/interaction.components';

export type PortalEntity = ECSEntity & BBox & Portal & Interactive;

export const createPortal = (
  state: GameState,
  { x, y, isEntrance, isExit }: Point & { isEntrance: boolean; isExit: boolean }
): PortalEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        x: x + 0.5,
        y: y + 0.5,
        width: 1,
        height: 1.5
      })
    )
    .with(
      portal.component({
        isEntrance,
        isExit
      })
    )
    .with(
      interactive.component({
        isEnabled: true,
        activationRange: 1
      })
    )
    .build();

  state.tree.insert(entity);

  return entity;
};
