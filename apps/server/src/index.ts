import http from 'http';
import { config } from './config';
import { container } from './container';
import { createApp } from './app';
import { createIo } from './io';

const main = () => {
  const server = http.createServer(createApp());

  createIo({
    server,
    authenticateUseCase: container.resolve('authenticateUseCase')
  });

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
};

main();
