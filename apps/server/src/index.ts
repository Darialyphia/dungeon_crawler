import { config } from './config';
import { container } from './container';

const main = () => {
  const { server, io } = container.cradle;

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
};

main();
