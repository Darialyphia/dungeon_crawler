import { AppSocket, Io } from '../core/io';
import { GameRepository } from './game.repository';
import { GameInstancePool, gameInstancePool } from './gameInstance.pool';
import * as E from 'fp-ts/Either';

import { LeaveGameUseCase, leaveGameUsecase } from './usecases/leaveGame.usecase';

type Dependencies = {
  gameRepo: GameRepository;
  leaveGameUseCase: LeaveGameUseCase;
  gameInstancePool: GameInstancePool;
};

export type GameIo = (socket: AppSocket) => void;

// We are not destructuring dependencies to avoid cyclic dependencies
// sunce dependencies are references to a proxy, as long as we don't eagerly access the deps, we're "fine"
// This definitely deservers a proper fix though
export const gameIo = (deps: Dependencies): GameIo => {
  return (socket: AppSocket) => {
    socket.on('disconnecting', async () => {
      const joinedGame = await deps.gameRepo.findByPlayerId(socket.data.userId);
      if (E.isLeft(joinedGame)) return;

      await deps.leaveGameUseCase({
        gameId: joinedGame.right.id,
        userId: socket.data.userId
      });
    });

    socket.on('GAME_ACTION', ({ gameId, action }) => {
      const gameInstance = deps.gameInstancePool.getOrCreate(gameId);

      if (E.isRight(gameInstance)) {
        gameInstance.right.dispatch(action.type, action.payload);
      }
    });
  };
};
