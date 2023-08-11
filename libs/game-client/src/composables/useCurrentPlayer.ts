import { useSafeInject } from "./useSafeInject";

type CurrentPlayerId = string;

export const CURRENT_PLAYER_INJECTION_KEY = Symbol(
  "current_player_id"
) as InjectionKey<CurrentPlayerId>;

export const useCurrentPlayerProvider = (player: CurrentPlayerId) => {
  provide(CURRENT_PLAYER_INJECTION_KEY, player);
};

export const useCurrentPlayerId = () =>
  useSafeInject(CURRENT_PLAYER_INJECTION_KEY);
