import { createGame } from '@dungeon-crawler/game-engine';
import { parentPort } from 'worker_threads';

const engine = createGame({ debug: false });
engine.subscribe(state => {
  parentPort?.postMessage(state);
});
parentPort?.on('message', data => {
  if (data.type === 'start') {
    console.log('GAME ENGINE WORKER: start');
    engine.start();
  } else if (data.type === 'stop') {
    console.log('GAME ENGINE WORKER: stop');
    engine.stop();
  } else {
    engine.dispatch(data.type, data.payload);
  }
});
