import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { Player, getPlayerById } from '../components/player';
import { position, Position } from '../components/position';
import { addVector } from '@dungeon-crawler/shared';
import { isNone } from 'fp-ts/Option';

export const moveEvent = defineEventHandler({
  input: z.object({
    playerId: z.string(),
    up: z.boolean(),
    down: z.boolean(),
    left: z.boolean(),
    right: z.boolean()
  }),
  handler: ({ input, state }) => {
    const playerOption = getPlayerById<[Position]>(input.playerId)(
      state.world,
      [position.brand]
    );
    if (isNone(playerOption)) return;

    const player = playerOption.value;
    if (player.player.id !== input.playerId) return;

    let diff = { x: 0, y: 0 };

    if (input.up) diff.y--;
    if (input.down) diff.y++;
    if (input.left) diff.x--;
    if (input.right) diff.x++;

    player.position = addVector(player.position, diff);
  }
});
