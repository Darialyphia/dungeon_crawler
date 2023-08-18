import { useGameState } from './useGameState';
import { useSafeInject } from './useSafeInject';

type CurrentPlayerId = string;

export const CURRENT_PLAYER_INJECTION_KEY = Symbol(
  'current_player_id'
) as InjectionKey<CurrentPlayerId>;

export const useCurrentPlayerProvider = (player: CurrentPlayerId) => {
  provide(CURRENT_PLAYER_INJECTION_KEY, player);
};

export const useCurrentPlayerId = () => useSafeInject(CURRENT_PLAYER_INJECTION_KEY);

export const useCurrentPlayer = () => {
  const id = useCurrentPlayerId();
  const { state } = useGameState();

  return computed(() => {
    for (const playerId in state.value.snapshot.players) {
      const player = state.value.snapshot.players[playerId];
      if (player.player.id === id) return player;
    }
  });
};
