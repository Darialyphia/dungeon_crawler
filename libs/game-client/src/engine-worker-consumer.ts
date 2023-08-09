import { SerializedGameState } from "@dungeon-crawler/game-engine";

export const createEngineWorkerConsumer = () => {
  console.log("Create engine worker");
  const state = ref<SerializedGameState>();

  const worker = new Worker(new URL("./engine-worker.ts", import.meta.url), {
    type: "module",
  });
  worker.addEventListener("message", ({ data }) => {
    state.value = data;
  });
  worker.postMessage({
    type: "join",
    payload: { id: "player" },
  });
  worker.postMessage({ type: "start" });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      worker.postMessage({
        type: "start",
      });
    } else {
      worker.postMessage({
        type: "stop",
      });
    }
  });

  return {
    state,
    dispatch: (event: any) => worker.postMessage(event),
  };
};
