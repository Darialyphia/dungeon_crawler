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
import { Emitter } from '../../core/providers/event-emitter';
import { pipe } from 'fp-ts/function';

export type CreateGameUseCase = UseCase<
  ServerInferRequest<GameContract['create']>['body'],
  Game,
  UnexpectedError | BadRequestError
>;

type Dependencies = {
  gameRepo: GameRepository;
  session: User;
  gameAbilityBuilder: GameAbilityBuilder;
  emitter: Emitter;
};

export const createGameUsecase =
  ({ gameRepo, gameAbilityBuilder, session, emitter }: Dependencies): CreateGameUseCase =>
  async data => {
    const ability = await gameAbilityBuilder.buildForUser(session);
    if (ability.cannot('create', 'Game')) {
      return E.left(errorFactory.badRequest());
    }

    return pipe(
      await gameRepo.create({
        ...data,
        authorId: session.id
      }),

      E.tap(game => E.right(emitter.emit('GAME_CREATED', game)))
    );
  };
