import http from 'http';
import { config } from './config';
import { container } from './container';
import { createApp } from './app';
import { createIo } from './io';
import { Worker } from 'worker_threads';

const main = () => {
  const server = http.createServer(createApp());

  // const worker = new Worker('./src/engine-worker.ts', {});
  // worker.on('message', function (data) {
  //   console.log(data);
  // });
  // worker.on('error', function (error) {
  //   console.log('error', error);
  //   worker.terminate();
  // });
  // worker.on('exit', code => {
  //   console.log('exit', code);
  //   if (code !== 0) worker.terminate();
  // });
  // worker.postMessage({ type: 'start' });

  createIo({
    server,
    authenticateUseCase: container.resolve('authenticateUseCase')
  });

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
};

main();
