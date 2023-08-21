import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { isNone } from 'fp-ts/Option';
import { getPlayerById } from '../features/player/player.components';
import {
  type BBox,
  type Velocity,
  type Orientation,
  bbox,
  velocity,
  orientation
} from '../features/physics/physics.components';
import { attacker } from '../features/combat/combat.components';
import { Animatable, animatable } from '../features/render/render.components';

export const attackEvent = defineEventHandler({
  input: z.object({
    playerId: z.string()
  }),
  handler: ({ input, state }) => {
    const attackingPlayer = state.players.find(p => p.id === input.playerId);
    if (!attackingPlayer) return;

    const zone = state.zones.find(z => z.id === attackingPlayer?.currentZoneId);
    if (!zone) return;

    const maybePlayer = getPlayerById<[BBox, Velocity, Orientation, Animatable]>(
      input.playerId
    )(zone.world, [bbox.brand, velocity.brand, orientation.brand, animatable.brand]);

    if (isNone(maybePlayer)) return;
    const player = maybePlayer.value;
    if (!attacker.has(player)) return;
    if (player.attacker.attackStartedAt) return;

    player.animatable.state = 'attacking';
    player.attacker.attackStartedAt = performance.now();

    if (velocity.has(player)) {
      player.velocity.target = { x: 0, y: 0 };
    }
  }
});
