import { Worker } from 'worker_threads';
import { resolve } from 'path';
import { UnexpectedError, errorFactory } from '../../utils/errorFactory';
import { GameId } from './game.entity';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { config } from '../../config';
import { GameRepository } from './game.repository';
import { Io } from '../core/io';
import { DispatchFunction } from '@dungeon-crawler/game-engine';
import { Nullable } from '@dungeon-crawler/shared';

export type GameInstancePool = {
  spawn(id: GameId): E.Either<UnexpectedError, GameInstance>;
  scheduleShutdown(id: GameId): O.Option<void>;
  getInstance(id: GameId): O.Option<GameInstance>;
  isFull(): boolean;
};

export type GameInstance = {
  start(): void;
  stop(): void;
  scheduleShutdown(): void;
  dispatch: DispatchFunction;
};

type Dependencies = {
  gameRepo: GameRepository;
  io: Io;
};

export const gameInstancePool = ({ gameRepo, io }: Dependencies): GameInstancePool => {
  const instances = new Map<GameId, GameInstance>();

  const createInstance = (id: GameId): GameInstance => {
    const worker = new Worker(resolve(process.cwd(), 'src/engine-worker.ts'), {});
    worker.on('message', data => {
      io.in(id).emit('GAME_STATE_UPDATE', { gameId: id, state: data });
    });

    worker.on('error', async error => {
      console.log('worker error', error);
      worker.terminate();
    });

    worker.on('exit', () => {
      console.log('worker terminated');
      io.in(id).socketsLeave(id);
      gameRepo.delete(id);
    });

    let shutdownTimeout: Nullable<ReturnType<typeof setTimeout>>;

    return {
      start() {
        console.log('starting game instance');
        return worker.postMessage({ type: 'start' });
      },
      stop() {
        console.log('stopping game instance');
        return worker.postMessage({ type: 'stop' });
      },
      scheduleShutdown() {
        console.log('scheduling game instance shutdown');
        shutdownTimeout = setTimeout(() => {
          console.log('shutting down game instance');
          worker.terminate();
        }, config.ENGINE_WORKERS.SHUTDOWN_TIMEOUT);
      },
      dispatch(type, payload) {
        if (type === 'join' && shutdownTimeout) {
          console.log('Player rejoined, cancelling game instance shutdown');
          clearTimeout(shutdownTimeout);
          shutdownTimeout = null;
        }

        return worker.postMessage({ type, payload });
      }
    };
  };

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

      const instance = createInstance(id);
      instances.set(id, instance);

      return E.right(instance);
    },

    scheduleShutdown(id) {
      const instance = instances.get(id);
      return O.fromNullable(instance?.scheduleShutdown());
    },

    getInstance(id) {
      return O.fromNullable(instances.get(id));
    }
  };
};
