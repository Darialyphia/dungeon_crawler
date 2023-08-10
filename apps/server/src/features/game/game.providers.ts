import { Lifetime, asFunction } from 'awilix';
import { getAllGamesUsecase } from './usecases/getAllGames.usecase';
import { gameRepository } from './game.repository';
import { gameMapper } from './game.mapper';
import { createGameUsecase } from './usecases/createGame.usecase';
import { joinGameUsecase } from './usecases/joinGame.usecase';
import { leaveGameUsecase } from './usecases/leaveGame.usecase';
import { gameAbilityBuilder } from './game.ability';
import { gameInstancePool } from './gameInstance.pool';
import { gameSubscribers } from './game.subscribers';
import { gameIo } from './game.io';

export const gameProviders = {
  gameRepo: asFunction(gameRepository),
  gameMapper: asFunction(gameMapper),
  gameAbilityBuilder: asFunction(gameAbilityBuilder),
  gameInstancePool: asFunction(gameInstancePool, { lifetime: Lifetime.SINGLETON }),
  gameSubscribers: asFunction(gameSubscribers),
  gameIo: asFunction(gameIo),

  getAllGamesUseCase: asFunction(getAllGamesUsecase),
  createGameUseCase: asFunction(createGameUsecase),
  joinGameUseCase: asFunction(joinGameUsecase),
  leaveGameUseCase: asFunction(leaveGameUsecase)
};
