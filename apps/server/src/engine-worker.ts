import { createGame } from '@dungeon-crawler/game-engine';
import { parentPort } from 'worker_threads';

const engine = createGame({ debug: false });
engine.subscribe(state => {
  parentPort?.postMessage(state);
});
parentPort?.on('message', data => {
  console.log('message received in worker', data.type);
  if (data.type === 'start') {
    engine.start();
  } else if (data.type === 'stop') {
    engine.stop();
  } else {
    engine.dispatch(data.type, data.payload);
  }
});
