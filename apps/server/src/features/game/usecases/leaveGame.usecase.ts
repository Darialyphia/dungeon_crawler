import { ServerInferRequest } from '@ts-rest/core';
import {
  BadRequestError,
  NotFoundError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { Game, GameId } from '../game.entity';
import { GameRepository } from '../game.repository';
import { User } from '../../user/user.entity';
import * as E from 'fp-ts/Either';

export type LeaveGameUseCase = UseCase<
  { gameId: GameId },
  Game,
  UnexpectedError | BadRequestError | NotFoundError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
};

export const leaveGameUsecase =
  ({ gameRepo, session }: Dependencies): LeaveGameUseCase =>
  async ({ gameId }) => {
    const gameEither = await gameRepo.findById(gameId);

    if (E.isLeft(gameEither)) {
      return gameEither;
    }

    const isInGame = gameEither.right.players.some(p => p.id === session.id);
    if (!isInGame) {
      return E.left(errorFactory.badRequest({ message: 'User is not in this game' }));
    }

    return gameRepo.leave({
      gameId: gameId,
      playerId: session.id
    });
  };
