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
import { GameAbilityBuilder } from '../game.ability';
import { subject } from '@casl/ability';

export type LeaveGameUseCase = UseCase<
  { gameId: GameId },
  Game,
  UnexpectedError | BadRequestError | NotFoundError
>;

type Dependencies = {
  gameRepo: GameRepository;
  gameAbilityBuilder: GameAbilityBuilder;
  session: User;
};

export const leaveGameUsecase =
  ({ gameRepo, gameAbilityBuilder, session }: Dependencies): LeaveGameUseCase =>
  async ({ gameId }) => {
    const gameEither = await gameRepo.findById(gameId);

    if (E.isLeft(gameEither)) {
      return gameEither;
    }

    const ability = await gameAbilityBuilder.buildForUser(session);
    if (ability.cannot('leave', subject('Game', gameEither.right))) {
      return E.left(errorFactory.badRequest());
    }

    return gameRepo.leave({
      gameId: gameId,
      playerId: session.id
    });
  };
