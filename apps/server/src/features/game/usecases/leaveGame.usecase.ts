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
import { GameInstancePool } from '../gameInstance.pool';

export type LeaveGameUseCase = UseCase<
  { gameId: GameId },
  Game,
  UnexpectedError | BadRequestError | NotFoundError
>;

type Dependencies = {
  gameRepo: GameRepository;
  gameAbilityBuilder: GameAbilityBuilder;
  session: User;
  gameInstancePool: GameInstancePool;
};

export const leaveGameUsecase =
  ({
    gameRepo,
    gameAbilityBuilder,
    gameInstancePool,
    session
  }: Dependencies): LeaveGameUseCase =>
  async ({ gameId }) => {
    const gameEither = await gameRepo.findById(gameId);

    if (E.isLeft(gameEither)) {
      return gameEither;
    }

    const ability = await gameAbilityBuilder.buildForUser(session);
    if (ability.cannot('leave', subject('Game', gameEither.right))) {
      return E.left(errorFactory.badRequest());
    }

    const updatedGameEither = await gameRepo.leave({
      gameId: gameId,
      playerId: session.id
    });

    const isEmpty =
      E.isRight(updatedGameEither) && !updatedGameEither.right.players.length;
    if (isEmpty) gameInstancePool.terminate(gameId);

    return updatedGameEither;
  };
