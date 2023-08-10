import { config } from './config';
import { container } from './container';

const main = () => {
  const { server, gameSubscribers } = container.cradle;

  gameSubscribers();

  server.listen(config.PORT, () => {
    console.log(`Server ready on port ${config.PORT}`);
  });
};

main();
