import { SerializedPlayerState } from '@dungeon-crawler/game-engine';
import { Nullable } from '@dungeon-crawler/shared';
import { useSafeInject } from './useSafeInject';

type State = { snapshot: SerializedPlayerState; timestamp: number };
export type GameState = {
  state: ComputedRef<State>;
  prevState: ComputedRef<Nullable<State>>;
};

export const GAME_STATE_INJECTION_KEY = Symbol('game_state') as InjectionKey<GameState>;

export const useGameStateProvider = (state: Ref<SerializedPlayerState>) => {
  const { history } = useRefHistory(state, { capacity: 1 });

  const api: GameState = {
    state: computed(() => history.value[0]),
    prevState: computed(() => history.value[1])
  };

  provide(GAME_STATE_INJECTION_KEY, api);

  return api;
};

export const useGameState = () => useSafeInject(GAME_STATE_INJECTION_KEY);
