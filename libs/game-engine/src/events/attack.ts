import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { Point, addVector, setMagnitude } from '@dungeon-crawler/shared';
import { isNone } from 'fp-ts/Option';
import {
  PlayerState,
  getPlayerById,
  playerState
} from '../features/player/player.components';
import {
  type BBox,
  type Velocity,
  type Orientation,
  bbox,
  velocity,
  orientation
} from '../features/physics/physics.components';
import { attacker } from '../features/combat/combat.components';

export const attackEvent = defineEventHandler({
  input: z.object({
    playerId: z.string()
  }),
  handler: ({ input, state }) => {
    const attackingPlayer = state.players.find(p => p.id === input.playerId);
    if (!attackingPlayer) return;

    const zone = state.zones.find(z => z.id === attackingPlayer?.currentZoneId);
    if (!zone) return;

    const maybePlayer = getPlayerById<[BBox, Velocity, Orientation, PlayerState]>(
      input.playerId
    )(zone.world, [bbox.brand, velocity.brand, orientation.brand, playerState.brand]);

    if (isNone(maybePlayer)) return;
    const player = maybePlayer.value;
    if (!attacker.has(player)) return;
    if (player.playerState.state === 'attacking') return;
    player.playerState.state = 'attacking';
    player.attacker.attackStartedAt = performance.now();
    if (velocity.has(player)) {
      player.velocity.target = { x: 0, y: 0 };
    }
  }
});
