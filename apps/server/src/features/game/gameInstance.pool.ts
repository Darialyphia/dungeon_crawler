import { Worker } from 'worker_threads';
import { resolve } from 'path';
import { UnexpectedError, errorFactory } from '../../utils/errorFactory';
import { GameId } from './game.entity';
import * as E from 'fp-ts/Either';
import { config } from '../../config';
import { GameRepository } from './game.repository';
import { Io } from '../core/io';

export type GameInstancePool = {
  spawn(id: GameId): E.Either<UnexpectedError, Worker>;
  terminate(id: GameId): null;
  isFull(): boolean;
};

type Dependencies = {
  gameRepo: GameRepository;
  io: Io;
};

export const gameInstancePool = ({ gameRepo, io }: Dependencies): GameInstancePool => {
  const engines = new Map<GameId, Worker>();

  return {
    isFull() {
      return engines.size >= config.ENGINE_WORKERS.MAX_INSTANCES;
    },

    spawn(id) {
      if (engines.size === config.ENGINE_WORKERS.MAX_INSTANCES) {
        return E.left(errorFactory.unexpected({ message: 'max engine instances' }));
      }

      const worker = new Worker(resolve(process.cwd(), 'src/engine-worker.ts'), {});
      worker.on('message', function (data) {
        console.log(data);
      });

      worker.on('error', async error => {
        console.log(error);
        io.in(id).socketsLeave(id);
        gameRepo.delete(id);

        worker.terminate();
      });

      worker.on('exit', code => {
        io.in(id).socketsLeave(id);
        gameRepo.delete(id);

        if (code !== 0) worker.terminate();
      });

      return E.right(worker);
    },

    terminate(id) {
      const worker = engines.get(id);
      worker?.terminate();

      return null;
    }
  };
};
