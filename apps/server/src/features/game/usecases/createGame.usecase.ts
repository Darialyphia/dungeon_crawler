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

export type CreateGameUseCase = UseCase<
  ServerInferRequest<GameContract['create']>['body'],
  Game,
  UnexpectedError | BadRequestError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
  gameAbilityBuilder: GameAbilityBuilder;
};

export const createGameUsecase =
  ({ gameRepo, gameAbilityBuilder, session }: Dependencies): CreateGameUseCase =>
  async data => {
    const ability = await gameAbilityBuilder.buildForUser(session);

    if (ability.cannot('create', 'Game')) {
      return E.left(errorFactory.badRequest());
    }

    return gameRepo.create({
      ...data,
      authorId: session.id
    });
  };
