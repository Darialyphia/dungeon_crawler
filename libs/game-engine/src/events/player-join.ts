import { z } from 'zod';
import { defineEventHandler } from '../utils';

export const playerJoinEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    const startingZone = state.zones[0];
    const entity_id = startingZone.addPlayer(input.id);

    state.players.push({
      id: input.id,
      entity_id,
      currentZoneId: startingZone.id
    });
  }
});
