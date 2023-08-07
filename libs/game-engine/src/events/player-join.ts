import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { createPlayer } from '../entity/player.factory';

export const playerJoinEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    createPlayer(state, input);
  }
});
