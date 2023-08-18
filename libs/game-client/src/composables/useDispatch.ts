import { GameEngine } from '@dungeon-crawler/game-engine';
import { useSafeInject } from './useSafeInject';

export type DispatcherArg = {
  type: Parameters<GameEngine['dispatch']>[0];
  payload: Parameters<GameEngine['dispatch']>[1];
};
export type Dispatcher = (arg: DispatcherArg) => void;

export const DISPATCHER_INJECTION_KEY = Symbol('dispatcher') as InjectionKey<Dispatcher>;

export const useDispatchProvider = (dispatcher: Dispatcher) => {
  provide(DISPATCHER_INJECTION_KEY, dispatcher);

  return dispatcher;
};

export const useDispatch = () => useSafeInject(DISPATCHER_INJECTION_KEY)!;
