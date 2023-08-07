import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { Player, PlayerBrand } from '../components/player';
import { hasPosition } from '../components/position';
import { addVector } from '@dungeon-crawler/shared';

export const moveEvent = defineEventHandler({
  input: z.object({
    playerId: z.string(),
    up: z.boolean(),
    down: z.boolean(),
    left: z.boolean(),
    right: z.boolean()
  }),
  handler: ({ input, state }) => {
    const players = state.world.entitiesByComponent<[Player]>([PlayerBrand]);
    players.forEach(player => {
      if (player.player.id !== input.playerId) return;

      if (!hasPosition(player)) return;

      let diff = { x: 0, y: 0 };

      if (input.up) diff.y--;
      if (input.down) diff.y++;
      if (input.left) diff.x--;
      if (input.right) diff.x++;

      player.position = addVector(player.position, diff);
    });
  }
});
