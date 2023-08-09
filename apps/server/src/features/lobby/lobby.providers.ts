import { asFunction } from 'awilix';
import { getAllLobbiesUsecase } from './usecases/getAllLobbies.usecase';
import { lobbyRepository } from './lobby.repository';
import { lobbyMapper } from './lobby.mapper';

export const lobbyProviders = {
  lobbyRepo: asFunction(lobbyRepository),
  lobbyMapper: asFunction(lobbyMapper),

  getAllLobbiesUseCase: asFunction(getAllLobbiesUsecase)
};
