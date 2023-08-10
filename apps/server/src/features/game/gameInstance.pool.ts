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
  const instances = new Map<GameId, Worker>();

  return {
    isFull() {
      return instances.size >= config.ENGINE_WORKERS.MAX_INSTANCES;
    },

    spawn(id) {
      if (instances.size === config.ENGINE_WORKERS.MAX_INSTANCES) {
        return E.left(
          errorFactory.unexpected({ message: 'Game worker instances capacity exceeded' })
        );
      }

      const worker = new Worker(resolve(process.cwd(), 'src/engine-worker.ts'), {});
      worker.on('message', data => {
        io.in(id).emit('GAME_STATE_UPDATE', data);
      });

      worker.on('error', async error => {
        console.log(error);
        worker.terminate();
      });

      worker.on('exit', () => {
        io.in(id).socketsLeave(id);
        gameRepo.delete(id);
      });

      return E.right(worker);
    },

    terminate(id) {
      const worker = instances.get(id);
      worker?.terminate();

      return null;
    }
  };
};
