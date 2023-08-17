import { useSafeInject } from "./useSafeInject";

type DebugOptions = {
  mapCoords: boolean;
  mapBitmask: boolean;
  obstacles: boolean;
  obstaclesMinkowski: boolean;
};

export const DEBUG_OPTIONS_INJECTION_KEY = Symbol(
  "debug options"
) as InjectionKey<Ref<DebugOptions>>;

export const useDebugOptionsProvider = () => {
  const options = useStorage("debug-options", {
    mapCoords: false,
    mapBitmask: false,
    obstacles: false,
    obstaclesMinkowski: false,
  });
  provide(DEBUG_OPTIONS_INJECTION_KEY, options);

  return options;
};

export const useDebugOptions = () => useSafeInject(DEBUG_OPTIONS_INJECTION_KEY);
