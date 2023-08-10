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
import { GameAbilityBuilder } from '../game.ability';
import { GameInstancePool } from '../gameInstance.pool';

export type CreateGameUseCase = UseCase<
  ServerInferRequest<GameContract['create']>['body'],
  Game,
  UnexpectedError | BadRequestError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
  gameAbilityBuilder: GameAbilityBuilder;
  gameInstancePool: GameInstancePool;
};

export const createGameUsecase =
  ({
    gameRepo,
    gameAbilityBuilder,
    gameInstancePool,
    session
  }: Dependencies): CreateGameUseCase =>
  async data => {
    if (gameInstancePool.isFull()) {
      return E.left(errorFactory.badRequest({ message: 'game instance pool is full' }));
    }

    const ability = await gameAbilityBuilder.buildForUser(session);

    if (ability.cannot('create', 'Game')) {
      return E.left(errorFactory.badRequest());
    }

    const game = await gameRepo.create({
      ...data,
      authorId: session.id
    });

    if (E.isLeft(game)) return game;
    const worker = gameInstancePool.spawn(game.right.id);

    if (E.isLeft(worker)) {
      await gameRepo.delete(game.right.id);

      return E.left(errorFactory.unexpected());
    }

    return game;
  };
