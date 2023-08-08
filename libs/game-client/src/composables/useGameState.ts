import { SerializedGameState } from "@dungeon-crawler/game-engine";
import { Nullable } from "@dungeon-crawler/shared";
import { useSafeInject } from "./useSafeInject";

export type GameState = {
  state: ComputedRef<SerializedGameState>;
  prevState: ComputedRef<Nullable<SerializedGameState>>;
};

export const GAME_STATE_INJECTION_KEY = Symbol(
  "game_state"
) as InjectionKey<GameState>;

export const useGameStateProvider = (state: Ref<SerializedGameState>) => {
  const { history } = useRefHistory(state, { capacity: 1 });

  const api: GameState = {
    state: computed(() => history.value[0].snapshot),
    prevState: computed(() => history.value.at(-1)?.snapshot),
  };

  provide(GAME_STATE_INJECTION_KEY, api);

  return api;
};

export const useGameState = () => useSafeInject(GAME_STATE_INJECTION_KEY);
