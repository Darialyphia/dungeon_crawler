import { GameState } from '../../gameState';
import { ECSSystem } from '../ecs/ECSSystem';
import { Interactive, interactive } from '../interaction/interaction.components';
import { BBox, bbox, updatePosition } from '../physics/physics.components';
import { Portal, portal } from './map.components';
import { isNone } from 'fp-ts/Option';

export const portalsSystem = (): ECSSystem<[BBox, Portal, Interactive]> => {
  return {
    target: [bbox.brand, portal.brand, interactive.brand],
    run(world, props, entities) {
      entities.forEach(entity => {
        if (!entity.interactive.interactedBy) return;

        entity.interactive.interactedBy.forEach(entityId => {
          const maybePlayer = world.getEntity(entityId);
          if (isNone(maybePlayer)) return;

          const player = maybePlayer.value;
          if (!bbox.has(player)) return;

          const destination = entities.find(e =>
            entity.portal.isEntrance ? e.portal.isExit : e.portal.isEntrance
          );
          if (destination) {
            player.bbox = updatePosition(player.bbox, destination.bbox);
          }
        });

        entity.interactive.interactedBy = [];
      });
    }
  };
};
