import { Point } from '@dungeon-crawler/shared';
import { BBox, bbox } from '../../physics/physics.components';
import { ECSEntity } from '../../ecs/ECSEntity';
import { Portal, portal } from '../map.components';
import { Interactive, interactive } from '../../interaction/interaction.components';
import { GameZoneState } from '../../../gameZone';

export type PortalEntity = ECSEntity & BBox & Portal & Interactive;

export const createPortal = (
  state: GameZoneState,
  { x, y, isEntrance, isExit }: Point & { isEntrance: boolean; isExit: boolean }
): PortalEntity => {
  const entity = state.world
    .createEntity()
    .with(
      bbox.component({
        //fixes artifact on map tiles
        x: x + 0.501,
        y: y + 0.251,
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
