import { EventMap, Game } from "@dungeon-crawler/game-engine";
import { z } from "zod";

export type GameClientEvents = Omit<EventMap, "tick" | "join" | "leave">;

type GameClientEventArg<T extends keyof GameClientEvents> = Omit<
  z.infer<GameClientEvents[T]["input"]>,
  "playerId"
>;

export type GameClientEmitter = {
  move: [GameClientEventArg<"move">];
};

export type Dispatcher = <T extends keyof GameClientEvents>(
  name: T,
  arg: GameClientEventArg<T>
) => void;

export const DISPATCHER_INJECTION_KEY = Symbol(
  "dispatcher"
) as InjectionKey<Dispatcher>;

export const useDispatchProvider = (
  emit: <T extends keyof GameClientEvents>(
    name: T,
    arg: GameClientEventArg<T>
  ) => void
) => {
  provide(DISPATCHER_INJECTION_KEY, emit);
};

export const useDispatch = () => inject(DISPATCHER_INJECTION_KEY)!;
