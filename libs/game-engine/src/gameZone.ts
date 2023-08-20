import { mapRange } from '@dungeon-crawler/shared';
import { HEIGHT, WIDTH } from './constants';
import { ECSWorld, createWorld } from './features/ecs/ECSWorld';
import { createNoiseGenerator } from './features/map/generators/noise';
import {
  CELL_TYPES,
  GameMap,
  SerializedMap,
  createGameMap
} from './features/map/factories/map.factory';
import { physicsSystem } from './features/physics/physics.system';
import RBush from 'rbush';
import {
  BBox,
  Orientation,
  bbox,
  orientation
} from './features/physics/physics.components';
import { ECSEntity, ECSEntityId } from './features/ecs/ECSEntity';
import { portalsSystem } from './features/map/portal.system';
import { CreatePlayerOptions, createPlayer } from './features/player/player.factory';
import { PortalEntity } from './features/map/factories/portal.factory';
import {
  Player,
  PlayerId,
  PlayerState,
  player,
  playerState
} from './features/player/player.components';
import { Interactive, interactive } from './features/interaction/interaction.components';
import { Obstacle, obstacle, portal } from './features/map/map.components';
import { Spritable, spritable } from './features/render/render.components';

export type ZoneId = number;

export type GameZoneState = {
  id: ZoneId;
  world: ECSWorld;
  map: GameMap;
  tree: RBush<ECSEntity & BBox>;
  addPlayer(id: PlayerId, options?: Omit<CreatePlayerOptions, 'id'>): void;
  removePlayer(id: PlayerId): void;
  changePlayerZone(playerId: PlayerId, zoneId: ZoneId): void;
  run(timestamp: number): void;
  serialize(timestamp: number): SerializedGameZoneState;
};

export type SerializedGameZoneState = {
  timestamp: number;
  map: SerializedMap;
  players: Record<ECSEntityId, ECSEntity & BBox & Orientation & Player & PlayerState>;
  portals: Record<ECSEntityId, PortalEntity>;
  obstacles: Record<ECSEntityId, ECSEntity & BBox & Obstacle & Spritable>;
  debugObstacles: Record<ECSEntityId, ECSEntity & BBox & Obstacle>;
};

class ZoneTree extends RBush<ECSEntity & BBox> {
  toBBox(e: BBox) {
    return e.bbox;
  }
  compareMinX(a: BBox, b: BBox) {
    return a.bbox.minX - b.bbox.minX;
  }
  compareMinY(a: BBox, b: BBox) {
    return a.bbox.minY - b.bbox.minY;
  }
}

export const createZone = (
  id: number,
  changePlayerZone: (playerId: PlayerId, zoneId: ZoneId) => void
): GameZoneState => {
  let isRunning = false;

  const state: GameZoneState = {
    id,
    changePlayerZone,
    tree: new ZoneTree(),
    map: createGameMap({
      id,
      width: WIDTH,
      height: HEIGHT,
      tileset: 'base',
      generator: createNoiseGenerator({
        seed: id,
        scale({ x, y, value }) {
          const normalized = mapRange(value, [-1, 1], [0, 1]);
          if (normalized < 0.005) {
            return { x, y, type: CELL_TYPES.WATER };
          }
          if (normalized > 0.7) {
            return { x, y, type: CELL_TYPES.WALL };
          }
          return { x, y, type: CELL_TYPES.GROUND };
        }
      })
    }),
    world: createWorld(),
    addPlayer(playerId, options = {}) {
      createPlayer(state, { id: playerId, ...options });

      isRunning = true;
    },
    removePlayer(playerId) {
      player.findAll(state.world).forEach(player => {
        if (player.player.id === playerId) {
          state.world.deleteEntity(player.entity_id);
        }
      });
      const remaining = player.findAll(state.world);

      if (!remaining.length) {
        isRunning = false;
      }
    },

    run(delta: number) {
      if (!isRunning) return;

      state.world.runSystems({ delta });
    },
    serialize(timestamp) {
      const players = player.findAll<[BBox, PlayerState, Orientation]>(state.world, [
        bbox.brand,
        playerState.brand,
        orientation.brand
      ]);
      const bboxes = players
        .map(p =>
          state.tree.search({
            minX: p.bbox.x - 15,
            minY: p.bbox.y - 15,
            maxX: p.bbox.x + 15,
            maxY: p.bbox.y + 15
          })
        )
        .flat();

      const obstacles = obstacle
        .findAll<[BBox, Spritable]>(state.world, [bbox.brand, spritable.brand])
        .filter(obstacle => bboxes.includes(obstacle));

      const debugObstacles = obstacle
        .findAll<[BBox]>(state.world, [bbox.brand])
        .filter(obstacle => bboxes.includes(obstacle) && !obstacle.obstacle.isRendered);
      const portals = portal
        .findAll<[BBox, Interactive]>(state.world, [bbox.brand, interactive.brand])
        .filter(obstacle => bboxes.includes(obstacle));

      return {
        timestamp,
        map: state.map.serialize(players),
        players: Object.fromEntries(players.map(e => [e.entity_id, e])),
        debugObstacles: Object.fromEntries(debugObstacles.map(e => [e.entity_id, e])),
        obstacles: Object.fromEntries(obstacles.map(e => [e.entity_id, e])),
        portals: Object.fromEntries(portals.map(e => [e.entity_id, e]))
      };
    }
  };

  state.map.init(state);
  state.world.addSystem('physics', physicsSystem(state));
  state.world.addSystem('portals', portalsSystem(state));

  return state;
};