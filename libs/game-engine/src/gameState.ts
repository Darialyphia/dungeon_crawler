import { addVector } from '@dungeon-crawler/shared';
import { PlayerId } from './features/player/player.components';
import { GameZoneState, ZoneId, createZone } from './gameZone';
import { PlayerEntity } from './features/player/player.factory';
import { isNone } from 'fp-ts/Option';

type GamePlayer = {
  id: string;
  entity_id: number;
  currentZoneId: number;
};

export type GameState = {
  zones: GameZoneState[];
  players: GamePlayer[];
  changePlayerZone(playerId: PlayerId, zoneId: ZoneId): void;
};

export const createGameState = (): GameState => {
  let zoneId = 1;
  const getZoneId = () => zoneId++;

  const players: GamePlayer[] = [];
  const zones: GameZoneState[] = [];

  const changePlayerZone = (playerId: PlayerId, zoneId: ZoneId) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const currentZone = state.zones.find(z => z.id === player?.currentZoneId);
    const destinationZone = state.zones.find(z => z.id === zoneId);
    if (!currentZone || !destinationZone) return;

    const playerEntity = currentZone.world.getEntity<PlayerEntity>(player.entity_id);
    if (isNone(playerEntity)) return;

    player.currentZoneId = destinationZone.id;
    currentZone.removePlayer(playerId);
    const newEntityId = destinationZone.addPlayer(playerId, {
      character: playerEntity.value.spritable.sprite,
      position: addVector(
        currentZone.id < destinationZone.id
          ? destinationZone.map.getEntrance()
          : destinationZone.map.getExit(),
        { x: 0.501, y: 0.501 } // @FIXME generalize the position hack somewhere
      )
    });

    player.entity_id = newEntityId;

    if (destinationZone === state.zones.at(-1)) {
      zones.push(createZone(getZoneId(), changePlayerZone));
    }
  };
  zones.push(createZone(getZoneId(), changePlayerZone));
  zones.push(createZone(getZoneId(), changePlayerZone));

  const state: GameState = {
    players,
    zones,
    changePlayerZone
  };

  return state;
};
