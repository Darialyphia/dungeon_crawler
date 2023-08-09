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

export type JoinGameUseCase = UseCase<
  { gameId: GameId },
  Game,
  UnexpectedError | BadRequestError | NotFoundError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
};

export const joinGameUsecase =
  ({ gameRepo, session }: Dependencies): JoinGameUseCase =>
  async ({ gameId }) => {
    const gameEither = await gameRepo.findById(gameId);

    if (E.isLeft(gameEither)) {
      return gameEither;
    }

    const isAlreadyInGame = E.isRight(await gameRepo.findByPlayerId(session.id));
    if (isAlreadyInGame) {
      return E.left(
        errorFactory.badRequest({ message: 'User is already in another game.' })
      );
    }
    const hasAlreadyJoined = gameEither.right.players.some(p => p.id === session.id);
    if (hasAlreadyJoined) {
      return E.left(
        errorFactory.badRequest({ message: 'User is already in this game.' })
      );
    }

    return gameRepo.join({
      gameId: gameId,
      playerId: session.id
    });
  };
