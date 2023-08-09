import { asFunction } from 'awilix';
import { getAllGamesUsecase } from './usecases/getAllGames.usecase';
import { gameRepository } from './game.repository';
import { gameMapper } from './game.mapper';
import { createGameUsecase } from './usecases/createGame.usecase';
import { joinGameUsecase } from './usecases/joinGame.usecase';
import { leaveGameUsecase } from './usecases/leaveGame.usecase';

export const gameProviders = {
  gameRepo: asFunction(gameRepository),
  gameMapper: asFunction(gameMapper),

  getAllGamesUseCase: asFunction(getAllGamesUsecase),
  createGameUseCase: asFunction(createGameUsecase),
  joinGameUseCase: asFunction(joinGameUsecase),
  leaveGameUseCase: asFunction(leaveGameUsecase)
};
