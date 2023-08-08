/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { createGame } from "@dungeon-crawler/game-engine";
const engine = createGame({ debug: false });
engine.start();

self.addEventListener("message", ({ data }) => {
  engine.dispatch(data.name, data.payload);
});

engine.subscribe((state) => {
  self.postMessage(state);
});
