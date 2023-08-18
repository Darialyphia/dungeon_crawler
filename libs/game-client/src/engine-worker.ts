/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { createGame } from '@dungeon-crawler/game-engine';
const engine = createGame({ debug: false });

self.addEventListener('message', ({ data }) => {
  if (data.type === 'start') {
    engine.start();
  } else if (data.type === 'stop') {
    engine.stop();
  } else {
    engine.dispatch(data.type, data.payload);
  }
});

engine.subscribe(state => {
  self.postMessage(state);
});
