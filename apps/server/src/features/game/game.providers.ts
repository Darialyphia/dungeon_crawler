import { asFunction } from 'awilix';
import { getAllGamesUsecase } from './usecases/getAllGames.usecase';
import { gameRepository } from './game.repository';
import { gameMapper } from './game.mapper';

export const gameProviders = {
  gameRepo: asFunction(gameRepository),
  gameMapper: asFunction(gameMapper),

  getAllGamesUseCase: asFunction(getAllGamesUsecase)
};
