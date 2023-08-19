import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { interactive } from '../features/interaction/interaction.components';
import { isNone } from 'fp-ts/Option';
import { getPlayerById } from '../features/player/player.components';
import { bbox } from '../features/physics/physics.components';
import { dist } from '@dungeon-crawler/shared';

export const interactEvent = defineEventHandler({
  input: z.object({ entityId: z.number(), playerId: z.string() }),
  handler: ({ input, state }) => {
    const leavingPlayer = state.players.find(p => p.id === input.playerId);
    if (!leavingPlayer) return;

    const zone = state.zones.find(z => z.id === leavingPlayer?.currentZoneId);
    if (!zone) return;

    const maybeEntity = zone.world.getEntity(input.entityId);
    const maybePlayer = getPlayerById(input.playerId)(zone.world);

    if (isNone(maybeEntity) || isNone(maybePlayer)) return;

    const entity = maybeEntity.value;
    const player = maybePlayer.value;
    if (!bbox.has(player) || !bbox.has(entity) || !interactive.has(entity)) return;
    if (!entity.interactive.isEnabled) return;
    const distance = dist(player.bbox, entity.bbox);
    if (distance > entity.interactive.activationRange) return;

    if (interactive.has(entity)) {
      entity.interactive.interactedBy.push(player.entity_id);
    }
  }
});
