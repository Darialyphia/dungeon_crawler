import { z } from 'zod';
import { defineEventHandler } from '../utils';

export const moveEvent = defineEventHandler({
  input: z.object({ x: z.number(), y: z.number() }),
  handler: ({ input, state }) => {
    console.log('todo move event');
  }
});
