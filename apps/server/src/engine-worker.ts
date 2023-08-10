import { createGame } from '@dungeon-crawler/game-engine';
import { parentPort } from 'worker_threads';

console.log('hello from worker');
const engine = createGame({ debug: false });
engine.subscribe(state => {
  parentPort?.postMessage(state);
});
parentPort?.on('message', data => {
  console.log(data);
  if (data.type === 'start') {
    engine.start();
  } else if (data.type === 'stop') {
    engine.stop();
  } else {
    engine.dispatch(data.type, data.payload);
  }
});
