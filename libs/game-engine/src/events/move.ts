import { z } from 'zod';
import { defineEventHandler } from '../utils';
import { Point, addVector, setMagnitude } from '@dungeon-crawler/shared';
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
import { Animatable, animatable } from '../features/render/render.components';

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
    const movingPlayer = state.players.find(p => p.id === input.playerId);
    if (!movingPlayer) return;

    const zone = state.zones.find(z => z.id === movingPlayer?.currentZoneId);
    if (!zone) return;

    const maybePlayer = getPlayerById<[BBox, Velocity, Orientation, Animatable]>(
      input.playerId
    )(zone.world, [bbox.brand, velocity.brand, orientation.brand, animatable.brand]);

    if (isNone(maybePlayer)) return;

    const player = maybePlayer.value;
    if (player.animatable.state === 'attacking') return;

    const newVelocity = computeVelocity(input);

    const isMoving = newVelocity.x !== 0 || newVelocity.y !== 0;
    player.animatable.state = isMoving ? 'walking' : 'idle';

    if (newVelocity.x) {
      player.orientation = newVelocity.x < 0 ? 'left' : 'right';
    }
    player.velocity.target = newVelocity;
  }
});
