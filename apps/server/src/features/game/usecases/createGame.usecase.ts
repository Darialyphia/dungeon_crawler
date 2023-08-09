import { ServerInferRequest } from '@ts-rest/core';
import {
  BadRequestError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { Game } from '../game.entity';
import { GameRepository } from '../game.repository';
import { GameContract } from '@dungeon-crawler/contract';
import { User } from '../../user/user.entity';
import * as E from 'fp-ts/Either';

export type CreateGameUseCase = UseCase<
  ServerInferRequest<GameContract['create']>['body'],
  Game,
  UnexpectedError | BadRequestError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
};

export const createGameUsecase =
  ({ gameRepo, session }: Dependencies): CreateGameUseCase =>
  async data => {
    const isInGameChecks = await Promise.all([
      gameRepo.findByAuthorId(session.id),
      gameRepo.findByPlayerId(session.id)
    ]);
    const isInGame = isInGameChecks.some(E.isRight);

    if (isInGame) {
      return E.left(errorFactory.badRequest({ message: 'User is already in game.' }));
    }

    return gameRepo.create({
      ...data,
      authorId: session.id
    });
  };
