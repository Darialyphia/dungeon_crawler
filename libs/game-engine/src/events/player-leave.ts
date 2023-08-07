import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { Player, PlayerBrand } from '../components/player';

export const playerLeaveEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    const players = state.world.entitiesByComponent<[Player]>([PlayerBrand]);
    players.forEach(player => {
      if (player.player.id === input.id) {
        state.world.deleteEntity(player.entity_id);
      }
    });
  }
});
