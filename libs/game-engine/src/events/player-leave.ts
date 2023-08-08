import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { player } from '../features/player/player.components';

export const playerLeaveEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    player.findAll<[]>(state.world).forEach(player => {
      if (player.player.id === input.id) {
        state.world.deleteEntity(player.entity_id);
      }
    });
  }
});
