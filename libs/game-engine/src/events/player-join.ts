import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { createPlayer } from '../features/player/player.factory';

export const playerJoinEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    const startingZone = state.zones[0];
    startingZone.addPlayer(input.id);

    state.players.push({
      id: input.id,
      currentZoneId: startingZone.id
    });
  }
});
