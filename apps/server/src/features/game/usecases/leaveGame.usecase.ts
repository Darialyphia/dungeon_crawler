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
import { User, UserId } from '../../user/user.entity';
import * as E from 'fp-ts/Either';
import { GameAbilityBuilder } from '../game.ability';
import { subject } from '@casl/ability';
import { pipe } from 'fp-ts/function';
import { Emitter } from '../../core/providers/event-emitter';
import { UserRepository } from '../../user/user.repository';

export type LeaveGameUseCase = UseCase<
  { gameId: GameId; userId: UserId },
  Game,
  UnexpectedError | BadRequestError | NotFoundError
>;

type Dependencies = {
  userRepo: UserRepository;
  gameRepo: GameRepository;
  gameAbilityBuilder: GameAbilityBuilder;
  emitter: Emitter;
};

export const leaveGameUsecase =
  ({ gameRepo, gameAbilityBuilder, userRepo, emitter }: Dependencies): LeaveGameUseCase =>
  async ({ gameId, userId }) => {
    const gameEither = await gameRepo.findById(gameId);
    if (E.isLeft(gameEither)) {
      return gameEither;
    }

    // We are fetching the user instead of using the Session dependency, because we can call this usecase from the global container in  an io handler
    const user = await userRepo.findById(userId);
    if (E.isLeft(user)) return E.left(errorFactory.badRequest());

    const ability = await gameAbilityBuilder.buildForUser(user.right);

    if (ability.cannot('leave', subject('Game', gameEither.right))) {
      console.log('cannot leave');
      return E.left(errorFactory.badRequest());
    }

    return pipe(
      await gameRepo.leave({
        gameId: gameId,
        playerId: user.right.id
      }),

      E.tap(game => E.right(emitter.emit('USER_LEFT_GAME', { game, user: user.right })))
    );
  };
