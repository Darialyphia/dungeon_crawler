import { useSafeInject } from "./useSafeInject";

type CurrentPlayer = {
  id: string;
  name: string;
};

export const CURRENT_PLAYER_INJECTION_KEY = Symbol(
  "current_player"
) as InjectionKey<CurrentPlayer>;

export const useCurrentPlayerProvider = (player: CurrentPlayer) => {
  provide(CURRENT_PLAYER_INJECTION_KEY, player);
};

export const useCurrentPlayer = () =>
  useSafeInject(CURRENT_PLAYER_INJECTION_KEY);
