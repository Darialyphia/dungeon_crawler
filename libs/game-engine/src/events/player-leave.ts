import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { player } from '../features/player/player.components';

export const playerLeaveEvent = defineEventHandler({
  input: z.object({ id: z.string() }),
  handler: ({ input, state }) => {
    const leavingPlayer = state.players.find(p => p.id === input.id);
    if (!leavingPlayer) return;

    const zone = state.zones.find(z => z.id === leavingPlayer?.currentZoneId);
    if (!zone) return;

    // cleanup from world
    zone.removePlayer(input.id);

    // cleanup from global state
    state.players.splice(state.players.indexOf(leavingPlayer), 1);
  }
});
