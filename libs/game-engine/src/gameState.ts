import { PlayerId } from './features/player/player.components';
import { GameZoneState, ZoneId, createZone } from './gameZone';

type GamePlayer = {
  id: string;
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

    player.currentZoneId = destinationZone.id;
    currentZone.removePlayer(playerId);
    destinationZone.addPlayer(playerId);

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
