import { config } from './config';
import { container } from './container';
import express from 'express';
import { app } from './features/core/app';
import { server } from './features/core/server';
import { createIo } from './features/core/io';

const main = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
  }

  createIo({
    server,
    authenticateUseCase: container.resolve('authenticateUseCase')
  });

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
};

main();
