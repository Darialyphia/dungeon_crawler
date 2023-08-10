import { Worker } from 'worker_threads';
import { resolve } from 'path';
import { UnexpectedError, errorFactory } from '../../utils/errorFactory';
import { GameId } from './game.entity';
import * as E from 'fp-ts/Either';
import { config } from '../../config';
import { GameRepository } from './game.repository';

type GameEnginePool = {
  spawnEngine(id: GameId): E.Either<UnexpectedError, Worker>;
};

type Dependencies = {
  gameRepo: GameRepository;
};

export const gameEnginePool = ({ gameRepo }: Dependencies): GameEnginePool => {
  const engines = new Map<GameId, Worker>();

  return {
    spawnEngine(id) {
      if (engines.size === config.ENGINE_WORKERS.MAX_INSTANCES) {
        return E.left(errorFactory.unexpected({ message: 'max engine instances' }));
      }

      const worker = new Worker(resolve(process.cwd(), 'src/engine-worker.ts'), {});
      worker.on('message', function (data) {
        console.log(data);
      });
      worker.on('error', async error => {
        console.log(error);

        worker.terminate();
      });
      worker.on('exit', code => {
        console.log('exit', code);
        if (code !== 0) worker.terminate();
      });

      return E.right(worker);
    }
  };
};
