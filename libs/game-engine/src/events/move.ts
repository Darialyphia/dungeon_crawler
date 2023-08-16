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
  bbox,
  velocity
} from '../features/physics/physics.components';

type Directions = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export function computeVelocity(directions: Directions): Point {
  const vel = { x: 0, y: 0 };
  if (directions.right) {
    vel.x += 1;
  }
  if (directions.left) {
    vel.x -= 1;
  }
  if (directions.up) {
    vel.y -= 1;
  }
  if (directions.down) {
    vel.y += 1;
  }
  return vel;
}

export const moveEvent = defineEventHandler({
  input: z.object({
    playerId: z.string(),
    up: z.boolean(),
    down: z.boolean(),
    left: z.boolean(),
    right: z.boolean()
  }),
  handler: ({ input, state }) => {
    const maybePlayer = getPlayerById<[BBox, Velocity, PlayerState]>(
      input.playerId
    )(state.world, [bbox.brand, velocity.brand, playerState.brand]);

    if (isNone(maybePlayer)) return;

    const player = maybePlayer.value;
    if (player.player.id !== input.playerId) return;

    const newVelocity = computeVelocity(input);
    player.playerState.state =
      newVelocity.x === 0 && newVelocity.y === 0 ? 'idle' : 'walking';
    player.velocity.target = newVelocity;
  }
});
